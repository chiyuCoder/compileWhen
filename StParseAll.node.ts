import { StFileSystem } from "./StFileSystem.node";
import * as path from "path";
import * as fileSys from "fs";
import { stParseLess } from "./StParseLess.node";
import { stBabel } from "./StBabel.node";
import {argv} from "process";
const WEBROOT = path.resolve(__dirname, "../../");
const ADMIN_VIEW_ROOT = path.resolve(WEBROOT, "application/admin/view/proDefault");
const PUBLIC_ROOT = path.resolve(WEBROOT, "public/styles/proDefault");
let stFiler = new StFileSystem(),
    adminSons = stFiler.list(ADMIN_VIEW_ROOT),
    publicSons = stFiler.list(PUBLIC_ROOT),
    sons = adminSons.concat(publicSons);
stBabel.toPro();
stParseLess.mode = "pro";
for(let son of sons) {
    if (argv[2] == "delete") {
        if (son.match(/\.(es6|\.c\.less|\.map)$/)) {
            fileSys.unlink(son, err=> {
                throw err;
            });
        }
    } else {
        if (son.match(/\.es6$/)) {
            stBabel.toJs(son);
        } 
        if (son.match(/\.c\.less$/)) {
            stParseLess.toCss(son);
        }
        if (son.match(/\.map$/)) {
            fileSys.unlink(son, (err) => {
                if (err) {
                    throw err;
                } 
            });
        } 
    }
}

let addonMaps = stFiler.list(path.resolve(WEBROOT, "public/addons")),
    adminMaps = stFiler.list(path.resolve(WEBROOT, "public/admin")),
    children = addonMaps.concat(adminMaps);
for (let child of children) {
    if (child.match(/\.map$/)) {
        fileSys.unlink(child, (err) => {
            if (err) {
                throw err;
            }
        });
    }
}
