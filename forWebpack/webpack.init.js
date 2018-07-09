const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractLESS = new ExtractTextPlugin('[name].css');
const srcFloder = `${__dirname}/public/styles/`;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const CleanCSSPlugin = require('less-plugin-clean-css');
let webpack = require('webpack'),
    myFileSys = require("./fileSys"),
    webpackConfig = {
        output: {
            filename: '[name].js',
            sourceMapFilename: "[file].map",
            publicPath: "/"
        },
        externals: {
            jquery: 'jQuery',
            Clipboard: 'Clipboard',
            QRCode: 'QRCode',
            Vue: "Vue"
        },
        mode: 'production',
        devtool: 'sourcemap',
        target: 'web',
        resolve: {
            extensions: [".ts", ".less", ".js", ".css"]
        },
        module: {
            rules: [


                {
                    test: /\.vue$/,
                    include: [
                        myFileSys.sourceCodeRoot
                    ],
                    use: {
                        loader: 'vue-loader',
                    }
                },
                {
                    test: /\.es6$/,
                    include: [
                        myFileSys.sourceCodeRoot,
                    ],
                    use: {
                        loader: 'babel-loader',
                    }
                },
                {
                    test: /\.less$/,
                    include: [
                        myFileSys.sourceCodeRoot
                    ],
                    use: extractLESS.extract([{
                        loader: 'css-loader?sourceMap',
                        options: {
                            minimize: true,
                            sourceMap: true
                        }
                    }, {
                        loader: 'less-loader?sourceMap'
                    }])
                },
                {
                    test: /\.ts$/,
                    include: [
                        myFileSys.sourceCodeRoot,
                    ],
                    use: [

                        {
                            loader: 'ts-loader',
                        }
                    ],
                },
                {
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff2?|otf)$/i,
                    include: [
                        myFileSys.sourceCodeRoot,
                        path.resolve(__dirname, "../../public/static/font"),
                    ],
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            useRelativePath: false
                        }
                    }]
                }
            ]
        },
        plugins: [],
        watch: true,
    };

let webpackSetter = {
    setEnvironment(env = "development") {
        webpackConfig.mode = env;
        this.loadPluiginsOn(env);
        this.setSourceMap(env);
        return webpackConfig;
    },
    setSourceMap(env) {
        webpackConfig.devtool = "sourcemap";
        if (env == "production") {
            webpackConfig.sourcemap = "none";
        }
        return webpackConfig;
    },
    loadPluiginsOn(env) {
        webpackConfig.plugins = [
            extractLESS,
            new webpack.DllReferencePlugin({
                manifest: require(path.resolve(myFileSys.libBuildRoot, "Vue-manifest.json")),
            }),
        ];
        let uglifyjs = this.getUglifyJsPlugin();
        webpackConfig.plugins.push(uglifyjs);
        return webpackConfig;
    },
    getUglifyJsPlugin() {
        let options = this.getDevUglifyJsPlugin();
        if (webpackConfig.mode == "production") {
            options = this.getProUglifyJsPlugin();
        }
        return new UglifyJsPlugin(options);
    },
    getDevUglifyJsPlugin() {
        return {
            sourceMap: true,
            uglifyOptions: {
                compress: {
                    warnings: true,
                    drop_debugger: false,
                    drop_console: false
                }
            }
        };
    },
    getProUglifyJsPlugin() {
        return {
            uglifyOptions: {
                compress: {
                    drop_console: true,
                    pure_funcs: ["console.error"]
                }
            }
        };
    }
};
// let manifests = myFileSys.getAllManifests();
// for (let manifest of manifests) {
//     // webpackConfig.plugins.push(new webpack.DllReferencePlugin({
//     //     manifest: require(manifest),
//     // }));
// }
module.exports = webpackSetter;