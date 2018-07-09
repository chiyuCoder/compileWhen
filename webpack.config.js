const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractLESS = new ExtractTextPlugin('index.css');
const srcFloder = `${__dirname}/public/styles/proDefault/addons/redpack/setting/setting`;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');
let entrys = require('entrys.webpack.js');
module.exports = {
    entry: entrys,
    output: {
        path: srcFloder,
        filename: '[name].js',
        sourceMapFilename: "[file].map",
        // libraryTarget: "amd"
    },    
    optimization: {
        splitChunks: {
            cacheGroups: {
            },
            automaticNameDelimiter: '-',
        }
    },
    mode: 'development',
    devtool: 'source-map',
    target: 'web',
    module: {
        rules: [{
                test: /\.es6$/,
                include: [srcFloder],
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.less$/,
                include: [
                    srcFloder
                ],
                use: extractLESS.extract(['css-loader', 'less-loader'])
            },
            {
                test: /\.ts$/,
                use: ['ts-loader'],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].jpg',
                        useRelativePath: true
                    }
                }]
            }
        ],
    },
    plugins: [
        extractLESS,
        new UglifyJsPlugin(),
        new webpack.DllReferencePlugin({
            manifest: require('/www/web/think_diandingsc_cc/public_html/public/static/src/js/lib/build/jquery-manifest.json'),
            // sourceType: 'amd'
        })
    ],
    watch: false,
    // amd: {
    //     Shake: true
    // }
}