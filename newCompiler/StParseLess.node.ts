

import {stdin, stderr, exit, argv} from "process";
import * as fileSys from "fs";
import * as path from "path";
import * as less from "less";
// import * as LessPluginCleanCSS from "less-plugin-clean-css";
let LessPluginCleanCSS:any = require('less-plugin-clean-css');
import { StPromise } from "./StPromise";
import { stEcho } from "./StEcho.node";
// declare let LessPluginCleanCSS: any;
declare namespace StParseLess{
    export type mode = "dev" | "pro";
}

export class StParseLess{
    public options: any = {
        // compress: true,
        relativeUrls: false,
        lint: true,
        paths: [''],
        filename: '',
        plugins: [
            new LessPluginCleanCSS({
                advanced: true,
            })
        ],
        sourceMap: {
            outputFilename: '',
            outputSourceFiles: false,
            sourceMapFileInline: true,
        } 
    }
    public mode:StParseLess.mode   = "dev";
    public writeFile(filename: string, code: any) {
        return new StPromise((resolve, reject) => {
            fileSys.writeFile(filename, code, (err) => {
                if (err) {
                    stEcho.write(err);
                    reject(err);
                } else {
                    stEcho.info(`${filename}写入成功`);
                    resolve(code);
                }
            });
        });
    }
    public getLessData(lessFile) {    
        stEcho.info(`正在读取${lessFile}`);
        return new StPromise((resolve, reject) => {
            fileSys.readFile(lessFile, {encoding: "utf8"}, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    stEcho.info(`成功读取${lessFile}`);
                    resolve(data);
                }
            });
        });
    }
    public resetOptions(lessFile, cssFile) {
        let lessDir = path.dirname(lessFile);
        let opt = this.options;
        opt.paths = [lessDir];
        if (this.mode == "dev") { 
            this.options.sourceMap.sourceMapFileInline = true;
        } else {
            this.options.sourceMap.sourceMapFileInline = false;
        }
        return this.options;
    }
    public compileLess(data, lessFile, cssFile) {
        let lessDir = path.dirname(lessFile),
            opt = this.resetOptions(lessFile, cssFile),
            parser = this,
            mapFile = cssFile + ".map",
            result:any = less.render(data,  opt);
        stEcho.info(opt.sourceMap.sourceMapFileInline);
        result.then(function(output) {
            stEcho.info(`${cssFile}准备写入css`);
            parser.writeFile(cssFile, output.css);
        }).catch(err => {
            stEcho.write(err);
            stEcho.error("==xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            stEcho.error(`${lessFile}出现错误`);
            stEcho.error(err);
            stEcho.error("==xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        });
    }
    public toCss(lessFile: string, cssFile: string = "") {
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

export let stParseLess = new StParseLess();
