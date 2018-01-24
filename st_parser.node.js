const PATH_ROOT = __dirname.replace(/\/resource(\/?)$/, '');

let { stEcho } = require('./st_devtool.node'),
    { stFileSystem } = require('./st_filesystem.node'),
    node_command = require('child_process');

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
            stEcho.info(`${filename} on ${event}`);
            if (event == 'rename') {
                parser.stopAllMonitors(function () {
                    parser.createMonitors();
                });
            } else {
                let newFile = '',
                    cmd = '';
                if (parser.isES6Resource(filename) == '1') {
                    newFile = filename.replace(/.c.es(6*)$/, '.js');
                    cmd = `npx babel ${filename} --out-file ${newFile} --source-maps`;
                } else if (parser.isLessResource(filename) == '1') {
                    newFile = filename.replace(/.c.less(6*)$/, '.css');
                    cmd = `lessc -x --source-map --clean-css="--advanced" ${filename} ${newFile}`;
                } else if (parser.isLessPart(filename) == '1') {
                    parser.getExports(filename);
                }
                if (cmd) {
                    parser.executive(cmd);
                }
            }
        });
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
                } else {                    
                    console.log(filename);
                }
                console.log(filename);
                if (parser.isLessResource(filename) == '1') {
                    let newFile = filename.replace(/.c.less(6*)$/, '.css'),
                        cmd = `lessc -x --source-map --clean-css="--advanced" ${filename} ${newFile}`;
                    parser.executive(cmd);
                }
            }
        }
    }
    isES6Resource(file) {
        return this.isResourceOf(file, /\.c.es(6?)$/);
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