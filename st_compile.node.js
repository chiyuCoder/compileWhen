// let { stdin, exit } = require('process'), 
//     { StParse } = require('./st_parser.node'),
//     { stEcho } = require('./st_devtool.node');
let path = require("path"),
    colors = require("colors");
    colors;
let {stdin, exit, argv} = require("process"),
    watchFloders = [
        path.resolve(__dirname, "../public/styles/proDefault"),
        path.resolve(__dirname, "../application/admin/view"),
    ],
    // { argvs } = require("./argvs"),
    { StParse} = require('./st_parser.node');
// stdin.setEncoding("utf-8");
// stdin.on("readable", () => {
//     let chunk = stdin.read();
//     if (chunk != null) {
//         chunk = chunk.replace(/\r?\n$/, '');
//         stEcho.info(chunk);
//     }
// });
function watchingChanges(floders) {
    for (let floder of floders) {
        new StParse(floder);
        console.info(`监视${floder}的变化`.bgWhite.black);
    }
}
watchingChanges(watchFloders);