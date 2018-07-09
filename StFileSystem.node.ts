import * as fileSystem from "fs";
import * as path from "path";
import {stEcho} from "./StEcho.node";

export class StFileSystem{
    private webRoot: string = path.resolve(__dirname, "../../");
    public encode: string = "utf8";
    public list(dirname: string = this.webRoot, recurse: boolean = true): string[] {
        let encode = this.encode;
        let children = <string[]>fileSystem.readdirSync(dirname, {encoding: encode}),
            sons: string[] = [];
        if (recurse) {
            for (let child of children) {
                let childPath = path.join(dirname, child);
                let childState = fileSystem.lstatSync(childPath);
                sons.push(childPath);
                if (childState.isDirectory()) {
                    let childrenOfChild =  this.list(childPath, recurse);
                    sons = sons.concat(childrenOfChild);
                }
            }
        }
        return sons;
    }
    public getAllLess(dirname: string) {
        let reg = /\.less$/;
        return this.getProperFileOn(dirname, reg);
    }
    public getProperFileOn(dirname: string, reg: RegExp): string[] {
        let children = this.list(dirname),
            sons: string[] = [];
        for(let child of children) {
            if (child.match(reg)) {
                sons.push(child);
            }
        }
        return sons;
    }
}