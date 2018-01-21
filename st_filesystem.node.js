let fileSystem = require('fs'),
    { stEcho } = require('./st_devtool.node'),
    stFileSystemOrigin = {
        encoding: 'utf8',
        unionPath: (parentDir, childDir) => {
            if (!parentDir) {
                parentDir = '';
            } else {
                parentDir = parentDir.replace(/\/$/, '') + "/";
            }
            return parentDir + childDir;
        },
        getDescriptions: (dir) => {
            if (stFileSystemOrigin.exists(dir)) {
                let state = fileSystem.lstatSync(dir);
                return state;
            } else {
                return {};
            }
        },
        exists: (dir) => {
            return fileSystem.existsSync(dir);
        },
        mkdir: (dir) => {
            if (stFileSystemOrigin.exists(dir)) {
                stEcho.info(`${dir}已存在`);
                return true;
            } else {
                let dirArray = dir.split('/'),
                    len = dirArray.length,
                    curDir;
                for (let i = 0; i < len; i++) {
                    curDir += dirArray[i];
                    stFileSystemOrigin.__makeDirectory(curDir);
                }
            }
        },
        getPathInfo(pathString) {
            let matcher = pathString.match(/([^\/]*)\.(\w+)$/),
                pathInfo = {
                    fileName: pathString,
                    baseName: '',
                    extention: '',
                    directory: ''
                };
            if (matcher) {
                pathInfo.baseName = matcher[1] ? matcher[1] : '';
                pathInfo.extention = matcher[2] ? matcher[2] : '';
                let fileNameRE = new RegExp(matcher[0] + '$');
                pathInfo.directory = pathString.replace(fileNameRE, '');
            }
            return pathInfo;
        },
        __makeDirectory(dir) {
            if (stFileSystemOrigin.exists(dir)) {
                stEcho.info(`${dir}已存在`);
                return true;
            } else {
                stEcho.info(`准备生成${dir}`);
                fileSystem.mkdirSync(dir);
                stEcho.info(`已生成${dir}`);
            }
        },
        copy() {
            let obj = stFileSystemOrigin;
            return Object.assign(obj, {});
        },
        isDir(file) {
            return stFileSystemOrigin.isTypeOf(file, 'dir');
        },
        isFile(file) {
            return stFileSystemOrigin.isTypeOf(file, 'file');
        },
        isTypeOf(file, type = 'dir') {
            let funcs = {
                    'dir': 'isDirectory',
                    'directory': 'isDirectory',
                    'file': 'isFile'
                },
                func = funcs[type.toLowerCase()],
                isTrue = -1;
            if (stFileSystemOrigin.exists(file)) {
                let state = stFileSystem.getDescriptions(file),
                    isType = (state[func])();
                if (isType) {
                    isTrue = 1;
                }
            } else {
                isTrue = 0;
            }
            return isTrue;
        },
        monitoring(pathString, func) {
            let state = stFileSystemOrigin.getDescriptions(pathString),
                dirTree = [],
                monitors = [];
            if (state.isDirectory()) {
                dirTree = stFileSystemOrigin.getChildTree(pathString);
            } else if (state.isFile()) {
                dirTree = [ pathString ];
            } else {
                stEcho.error(`${pathString} 不是文件或文件夹类型`);
                return false;
            }
            for (let branch of dirTree) {
                let watcher = fileSystem.watch(branch, (event, fileName) => {
                    if (typeof func == 'function') {
                        let fullName = stFileSystemOrigin.unionPath(branch, fileName);
                        func(event, fullName);
                    }
                });
                monitors.push(watcher);
            } 
            return monitors;
        },
        getChildTree(parentPath, condition = 'directory') {
            let sons = fileSystem.readdirSync(parentPath, { encoding: stFileSystemOrigin.encoding }),
                size = sons.length,
                children = [parentPath];
            for (son of sons) {
                let sonFullName = stFileSystemOrigin.unionPath(parentPath, son),
                    sonState = stFileSystemOrigin.getDescriptions(sonFullName),
                    judger = false;
                if (condition == 'directory') {
                    judger = sonState.isDirectory();
                } else if(condition == 'all') {
                    judger = true;
                }
                if (judger) {
                    let grandsons = stFileSystemOrigin.getChildTree(sonFullName, condition);
                    children = children.concat(grandsons);
                }
            }
            return children;
        }
    },
    stFileSystem = Object.assign(fileSystem, stFileSystemOrigin);
module.exports = {
    stFileSystem: stFileSystem,
};