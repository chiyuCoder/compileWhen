const PATH_ROOT = __dirname.replace(/\/resource(\/?)$/, '');

let { stEcho } = require('./st_devtool.node'),
    { stFileSystem } = require('./st_filesystem.node'),
    node_command = require('child_process'),
    {es6Parser} = require("./st_parseEs6.node");
    // {lessParser} = require("./st_parseLess.node");

class StParse{
    constructor(url) {
        this.root = url;
        this.monitors = [];
        if (this.hasInstalled()) {
            this.createMonitors();
        } else {
            this.installPackages();
        }
    }
    installPackages() {
    }
    hasInstalled() {
        return true;
    }
    createMonitors() {
        let pathString = this.root,
            parser = this;
        stEcho.info(pathString);
        console.log('开启文件监视器==>');
        this.monitors = stFileSystem.monitoring(pathString, (event, filename) => {           
            if (event == 'rename') {
                parser.stopAllMonitors(function () {
                    parser.createMonitors();
                });
            } else {
                parser.parseFile(filename);               
            }
        });
    }
    parseFile(filename) {
        let newFile = '',
            cmd = '',
            parser = this,
            event = "change";
        if (parser.isES6Resource(filename) == '1') {
            stEcho.info(`${filename} on ${event}`);
            // newFile = filename.replace(/(\.c)?\.es(6*)$/, '.js');
            // cmd = `npx babel ${filename} --out-file ${newFile} --source-maps`;
            es6Parser.toJs(filename);
        } else if (parser.isLessResource(filename) == '1') {
            stEcho.info(`${filename} on ${event}`);
            newFile = filename.replace(/.c.less(6*)$/, '.css');
            cmd = `lessc -x --source-map --clean-css="--advanced" ${filename} ${newFile}`;
            // lessParser.toCss(filename);
        } else if (parser.isLessPart(filename) == '1') {
            // if (!filename.match(/\.\.less$/)) {
                // lessParser.compileAllLess();
            // }
            // parser.getExports(filename);
        } else if (parser.isTSResource(filename) == '1') {
            newFile = filename.replace(/\.ts$/, '.js');
            // cmd = `tsc ${filename}`;
        }
        if (cmd) {
            parser.executive(cmd);
        }
    }
    executive(cmd) {
        stEcho.info('准备执行');
        stEcho.info(cmd);
        node_command.exec(cmd, (err, stdout, stderr) => {
            // stEcho
            if (err) {
                stEcho.error(err);
            } else {
                stEcho.info(stderr);
                stEcho.info(stdout);
                stEcho.log(cmd, 'purple');
                stEcho.log('执行成功', 'purple');
            }
        });
    }
    stopAllMonitors(callback) {
        let monitors = this.monitors;
        for (let monitor of monitors) {
            monitor.close();
        }
        if (typeof callback == 'function') {
            callback();
        }
    }
    getExports(file) {
        let strings = stFileSystem.readFileSync(file, {encoding: stFileSystem.encoding});
        strings = strings.replace(/[\r\n\t\s]+/g, '');
        let matchers = strings.match(/\/*exports=\[([^\]]*)\]/),
            parser = this,
            pathInfo = stFileSystem.getPathInfo(file),
            dir = pathInfo.directory;
     
        if (matchers) {
            let filesString = matchers[1],
                files = filesString.split(","),
                len = files.length;
            for (let i = 0; i < len; i ++) {
                let filename = files[i],
                matcher = filename.match(/^\s*\'?([^\']*)\'?\s*$/);
                if (matcher) {
                    filename = matcher[1];
                    if (filename.indexOf('/') != 0) {
                        filename = stFileSystem.unionPath(dir, filename);
                    }
                } 
                console.log(filename);
                if (parser.isLessResource(filename) == '1') {
                    let newFile = filename.replace(/.c.less(6*)$/, '.css'),
                        cmd = `lessc --source-map --clean-css="--advanced" ${filename} ${newFile}`;
                    parser.executive(cmd);
                }
            }
        }
    }
    isES6Resource(file) {
        return this.isResourceOf(file, /\.es(6?)$/);
    }
    isTSResource(file) {
        return this.isResourceOf(file, /\.ts$/);
    }
    isLessResource(file) {
        return this.isResourceOf(file, /\.c.less$/);
    }
    isLessPart(file) {
        return this.isResourceOf(file, /\.less$/);
    }
    isResourceOf(file, reg) {
        let yesItIs = -1;
        if (stFileSystem.exists(file)) {
            if (file.match(reg)) {
                yesItIs = 1;
            }
        } else {
            yesItIs = 0;
        }
        return yesItIs;
    }
}

module.exports = {
    StParse: StParse
};