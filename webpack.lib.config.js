const path = require('path');
const libFloder = '/www/web/think_diandingsc_cc/public_html/public/static/src/js/lib/';
let webpack = require('webpack'),
    libsRoot = require("./compiler/forWebpack/fileSys"),
    webpackLibConfig = {
        resolve: {
            extensions: [".js"]
        },
        output: {
            path: path.resolve(libFloder, 'build'),
            filename: '[name].js',
            sourceMapFilename: "[file].map",
            library: '[name]',
        },
        mode: 'development',
        devtool: 'cheap-source-map',
        target: 'web',
        plugins: [
            new webpack.DllPlugin({
                path: path.resolve(libFloder, 'build', '[name]-manifest.json'),
                name: '[name]',
            })
        ],
        watch: false,
    };
console.log(libsRoot);
module.exports = webpackLibConfig;