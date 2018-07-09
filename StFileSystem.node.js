const fileSystem = require("fs"),
    os = require("os"),
    path = require("path"),
    {stEcho} = require("./st_devtool.node");
class StFileSystem {
    constructor() {
        let osname = os.platform();
        this.separator = "/";
        if (osname == "win32") {
            this.separator = "\\";
        }
    }
    isDir(pathname) {
        let fileStatus = fileSystem.lstatSync(pathname);
        return fileStatus.isDirectory();
    }
    exists(pathname) {
        return fileSystem.existsSync(pathname);
    }
    mkdir(prefix, dirname, mode = 777) {
        if (dirname == undefined) {
            prefix = "";
            dirname = prefix;
            mode = 777;
        } else {
            if (typeof dirname == "number") {
                mode = dirname;
                dirname = prefix;
                prefix = "";
            }
        }
        this._mkdir(prefix, dirname, mode);
    }
    _mkdir(prefix, dirname, mode) {
        stEcho.info(`准备创建${path.join(prefix, dirname)}`);
        let dirArray = dirname.split(this.separator),
            dirPath = prefix;
        for (let dir of dirArray) {
            dirPath = path.join(dirPath, dir);
            stEcho.info(`存在${dirPath}====>${this.exists(dirPath)}`);
            if (!this.exists(dirPath)) {
                stEcho.info(`正在创建${dirPath}`);
                fileSystem.mkdirSync(dirPath, mode);
            }
        }
        stEcho.success(`${dirPath}创建成功`);
    }
    remove(pathname) {
        fileSystem.unlink(pathname);
    }
    getChildren(pathname, level = 0) {
        let children = [];
        let files = fileSystem.readdirSync(pathname);
        let stFileSys = this;
        for (let filename of files) {
            let fullname = path.join(pathname, filename);
            children.push(fullname);
            if (stFileSys.isDir(fullname)) {
                if (level > 0) {
                    let childrenOfChild = stFileSys.getChildren(fullname, level - 1);
                    children = children.concat(childrenOfChild);
                }
            }
        }
        return children;
    }
}
let stFileSystem = new StFileSystem();
module.exports = {
    stFileSystem: stFileSystem
};