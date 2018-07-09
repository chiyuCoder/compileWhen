let fileSys = require("fs"),
    path = require("path"),
    less = require("less"),
    { stEcho } = require("./st_devtool.node");
let opt = { encoding: 'utf8' };

class Parser {
    constructor() {
        this.setFileOpt();
    }
    setFileOpt() {
        this.fileOpt = {
            encoding: "utf8",
        }
    }
    writeFile(cssFile, output, opt) {
        fileSys.writeFile(cssFile, output, opt, (err) => {
            if (err) {
                throw err;
            } else {
                stEcho.success(`${cssFile}成功写入`);
            }
        });
    }
    compileLess(data, lessFile, cssFile) {
        let lessDir = path.dirname(lessFile),
            opt = this.fileOpt,
            parser = this,
            mapFile = cssFile + ".map";
        less.render(data, {
            compress: true,
            relativeUrls: false,
            lint: true,
            paths: [lessDir],
            sourceMap: {
                outputFilename: mapFile,
                outputSourceFiles: true,
                sourceMapFileInline: true,
            } 
        }).then(function(output) {
            stEcho.info(`${cssFile}准备写入css`);
            parser.writeFile(cssFile, output.css, opt);
            parser.writeFile(mapFile, output.map, opt);     
        }).catch(err => {
            stEcho.error("==xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            stEcho.error(`${lessFile}出现错误`);
            stEcho.error(err);
            stEcho.error("==xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        });
    }
    getLessData(lessFile) {
        let opt = this.fileOpt;
        stEcho.info(`正在读取${lessFile}`);
        return new Promise((resolve, reject) => {
            fileSys.readFile(lessFile, opt, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    stEcho.info(`成功读取${lessFile}`);
                    resolve(data);
                }
            });
        });
    }
    getAllLess() {
        let opt = this.fileOpt;
        return new Promise((resolve, reject) => {
            fileSys.readFile(path.resolve(__dirname, "php/sourceFiles.json"), opt, (error, data) => {
                if (error) {
                    reject(error)
                } else {
                    let obj
                    try {
                        obj = JSON.parse(data);
                        // console.log(obj);
                        stEcho.info(`获取less列表成功`);
                    } catch (err) {
                        reject(err);
                        return;
                    }
                    resolve(obj);                    
                }
            });
        });
    }
    compileAllLess() {
        let parser = this;
        parser.getAllLess().then(obj => {
            let compilerLessArray = obj["c.less"];
            for (let lessFile of compilerLessArray) {
                let cssFile = lessFile.replace(/\.c\.less$/, '.css');
                parser.toCss(lessFile, cssFile);
            }
        }).catch(err => {
            stEcho.error(err);
        });
    }
    toCss(lessFile, cssFile = "") {
        let parser = this;
        let promise = parser.getLessData(lessFile);
        if (!cssFile) {
            cssFile = lessFile.replace(/\.c\.less$/, ".css");
        }
        promise.then(data => {
            parser.compileLess(data, lessFile, cssFile);
        }).catch(err => {
            stEcho.error(err);
        });
    }
}
let lessParser = new Parser();
lessParser.compileAllLess();
module.exports = {
    lessParser: lessParser
}