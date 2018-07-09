let fileSys = require('fs'),
    path = require('path');
class FileSysClass {
    constructor(style) {
        this.style = style;
        this.sourceCodeRoot = path.resolve(__dirname, "../../sourceCode");
        this.libCodeRoot = path.resolve(__dirname, "../../sourceCode/lib");
        this.libBuildRoot = path.resolve(__dirname, "../../public/static/src/js/lib/build");
        this.addonsCodeRoot = path.resolve(__dirname, "../../sourceCode/addons/");
        this.addonsBuildRoot = path.resolve(__dirname, "../../public/addons");
        this.adminCodeRoot = path.resolve(__dirname, "../../sourceCode/admin", this.style);
        this.adminBuildRoot = path.resolve(__dirname, "../../public/admin", this.style);
    }
    getAllFiles(dir, regExp = /.*/, recursive = false) {
        let files = fileSys.readdirSync(dir),
            properFiles = [];
        for (let file of files) {
            let fileFullName = path.resolve(dir, file),
                fileStat = fileSys.lstatSync(fileFullName);
            if (fileStat.isDirectory() && recursive) {
                properFiles = properFiles.concat(getAllFiles(fileFullName, regExp, recursive));
            } else {
                if (file.match(regExp)) {
                    properFiles.push(fileFullName);
                }
            }
        }
        return properFiles;
    }
    arrayToEntries(arr, relativePath, isDll = false) {
        let entries = {};
        if (typeof arr == 'string') {
            arr = [arr];
        }
        for (let item of arr) {
            let relative = path.relative(relativePath, item);
            relative = relative.replace(/\.(min\.)?(\.c\.less|less|es6|js|css)$/, '');
            if (isDll) {
                entries[relative] = [item];
            } else {
                entries[relative] = item;
            }
        }
        return entries;
    }
    getWebpackByAddon(addonNames, entryName = "", suffix = "ts") {
        let paths = [];
        if (typeof addonNames == "string") {
            paths = addonNames.split("/");
        } else {
            paths = addonNames;
            addonNames = addonNames.join("/");
        }
        let [addon, style, controller, action] = paths;
        if (!entryName) {
            entryName = action;
        }
        if (suffix) {
            suffix = "." + suffix;
        }
        let entryKey = path.join(addonNames, entryName),
            entryValue = path.join(this.addonsCodeRoot, entryKey + suffix),
            webpack = {
                entry: {},
                output: {
                    path: ""
                }
            };
        webpack.entry[entryKey] = entryValue;
        webpack.output.path = this.addonsBuildRoot;
        return webpack;
    }
    getWebpackByAdmin(controller, action, sourcename = "ts") {
        let defaultNames = ["less", "c.less", "es6", "ts", "js", "css"],
            extIndex = defaultNames.indexOf(sourcename),
            fullName = "",
            ext = "ts";
        if (extIndex >= 0) {
            sourcename = action + "." + sourcename;
            ext = defaultNames[extIndex];
        }
        fullName = path.join(controller, action, sourcename);
        if (extIndex < 0) {
            ext = path.extname(fullName);
        }
        let regExp = new RegExp("." + ext + "$"),
            entryKey = fullName.replace(regExp, ""),
            entryValue = path.resolve(this.adminCodeRoot, fullName),
            outPath = path.resolve(this.adminBuildRoot),
            config = {
                entry: {},

                output: {
                    path: outPath
                }
            };
        config.entry[entryKey] = entryValue;
        return config;
    }
    loadManifest(libName) {
        return path.resolve(this.libBuildRoot, libName + "-manifest.json");
    }
    getAllManifests() {
        let manifests = this.getAllFiles(this.libBuildRoot, /\-manifest\.json$/);
        return manifests;
    }
    addWebpackByAdmin(entrys, controller, action, sourcename = "ts") {
        let defaultNames = ["less", "c.less", "es6", "ts", "js", "css"],
            extIndex = defaultNames.indexOf(sourcename),
            fullName = "",
            ext = "ts";
        if (extIndex >= 0) {
            sourcename = action + "." + sourcename;
            ext = defaultNames[extIndex];
        }
        fullName = path.join(controller, action, sourcename);
        if (extIndex < 0) {
            ext = path.extname(fullName);
        }
        let regExp = new RegExp("." + ext + "$"),
            entryKey = fullName.replace(regExp, ""),
            entryValue = path.resolve(this.adminCodeRoot, fullName);
        entrys[entryKey] = entryValue;
        return entrys;
    }
}
let myFileSys = new FileSysClass('proDefault');
module.exports = myFileSys;