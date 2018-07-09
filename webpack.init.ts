import * as webpack from "webpack";
import * as path from "path";
import * as  MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as UglifyJsPlugin from "uglifyjs-webpack-plugin";
import { writeFile } from "fs";
let CleanCSSPlugin: any = require("less-plugin-clean-css");

type webpackMode = "development" | "production";
type entryType = "es6" | "js" | "ts";
interface IAdminEntry {
    controller: string;
    action: string;
    filename: string;
    type: entryType;
}
interface IAddonEntry extends IAdminEntry {
    module: string;
}
export class WebpackConf {
    private initConfig: webpack.Configuration = {
        entry: {},
        output: {
            path: path.resolve(__dirname, "../../public"),
            filename: '[name].js',
            sourceMapFilename: "[file].map",
            publicPath: "",
        },
        devtool: "source-map",
        target: "web",
        resolve: {
            extensions: [".ts", ".less", ".js", ".css"]
        },
        plugins: [],
        module: {
            rules: [

            ]
        },
        watch: false,
        externals: {
            jquery: 'jQuery',
            Clipboard: 'Clipboard',
            QRCode: 'QRCode',
            Vue: "Vue"
        }
    };
    private style: string = "proDefault";
    private sourceFloder: string = path.resolve(__dirname, "../../sourceCode");
    setStyle(style: string): this {
        this.style = style;
        return this;
    }
    setMode(mode: webpackMode): this {
        if (mode == "production") {
            this.toPro();
        } else {
            this.toDev();
        }
        return this;
    }
    toPro(): this {
        this.initConfig.mode = "production";
        this.initConfig.devtool = false;
        return this.closeWatch();
    }
    closeWatch(): this {
        this.initConfig.watch = false;
        return this;
    }
    openWatch(): this {
        this.initConfig.watch = true;
        return this;
    }
    toDev(): this {
        this.initConfig.mode = "development";
        this.initConfig.devtool = "source-map";
        return this.openWatch();
    }
    addEntry(name: string, value: string): this {
        let entries = this.initConfig.entry;
        entries[name] = value;
        return this;
    }
    addAddonsEntry(
        entry: string | IAddonEntry,
        controller = "show",
        action = "index",
        filename = "",
        type: entryType = "ts"
    ): this {
        let addonEntry: IAddonEntry;
        if (typeof entry === "object") {
            addonEntry = entry;
        } else {
            let strIndex = entry.indexOf("/"),
                modulename = entry;
            if (strIndex < 0) {
                if (!filename) {
                    filename = action;
                }
            } else {
                let arr = entry.split("/");
                modulename = arr[0];
                controller = arr[1];
                action = arr[2];
                if (!arr[3]) {
                    filename = action;
                } else {
                    let pointIndex = arr[3].lastIndexOf(".");
                    if (pointIndex < 0) {
                        filename = arr[3];
                    } else {
                        filename = arr[3].slice(0, pointIndex);
                        type = <entryType>arr[3].slice(pointIndex + 1);
                    }
                }
            }
            addonEntry = {
                module: modulename,
                controller: controller,
                action: action,
                filename: filename,
                type: type
            }
        }
        let name = `addons/${addonEntry.module}/${this.style}/${addonEntry.controller}/${addonEntry.action}/${addonEntry.filename}`,
            value = path.resolve(this.sourceFloder, name + "." + addonEntry.type);
        return this.addEntry(name, value);
    }
    addAdminEntry(
        entry: IAdminEntry | string,
        action: string = "",
        filename: string = "",
        type: entryType = "ts"
    ): this {
        let adminEntry: IAdminEntry;
        if (typeof entry == "object") {
            adminEntry = entry;
        } else {
            let controller = entry;
            if (!action) {
                let arr = entry.split("/");
                controller = arr[0];
                action = arr[1];
                if (!arr[2]) {
                    filename = action;
                } else {
                    let pointIndex = arr[2].lastIndexOf(".");
                    if (pointIndex < 0) {
                        filename = arr[2];
                    } else {
                        filename = arr[2].slice(0, pointIndex);
                        type = <entryType>arr[2].slice(pointIndex + 1);
                    }
                }
            }
            if (!filename) {
                filename = action;
            }
            adminEntry = {
                controller: controller,
                filename: filename,
                action: action,
                type: type
            }
        }
        let name = `admin/${this.style}/${adminEntry.controller}/${adminEntry.action}/${adminEntry.filename}`,
            value = path.resolve(this.sourceFloder, name + "." + adminEntry.type);
        return this.addEntry(name, value);
    }
    addUglifyJSPlugin(): this {
        let plugin: UglifyJsPlugin;
        if (this.initConfig.mode == "development") {
            plugin = new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        warnings: true,
                        drop_debugger: false,
                        drop_console: false
                    }
                }
            });
        } else {
            plugin = new UglifyJsPlugin({
                sourceMap: false,
                uglifyOptions: {
                    compress: {
                        drop_console: true,
                        pure_funcs: ["console.error"]
                    }
                }
            });
        }
        return this.addPlugin(plugin);
    }
    addPlugin(newPlugin: webpack.Plugin): this {
        this.initConfig.plugins.push(newPlugin);
        return this;
    }
    addDllPlugin(dllPath: string): this {
        let dll = new webpack.DllReferencePlugin({
            manifest: require(dllPath),
            context: path.resolve("../../"),
        });
        return this.addPlugin(dll);
    }
    addMiniCssPlugin(): this {
        let miniCss = new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        });
        return this.addPlugin(miniCss);
    }
    addRule(newRule: webpack.RuleSetRule): this {
        this.initConfig.module.rules.push(newRule);
        return this;
    }
    addBaseRules(): this {
        let sourceRoot = this.sourceFloder,
            baseRules = [
                {
                    test: /\.vue$/,
                    include: [
                        sourceRoot
                    ],
                    use: {
                        loader: 'vue-loader',
                    }
                },
                {
                    test: /\.es6$/,
                    include: [
                        sourceRoot
                    ],
                    use: {
                        loader: 'babel-loader',
                    }
                },
                {
                    test: /\.less$/,
                    include: [
                        sourceRoot
                    ],
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                url: false
                            }
                        },
                        {
                            loader: "less-loader",
                            options: {
                                relativeUrls: false,
                                plugins: [
                                    new CleanCSSPlugin({
                                        advanced: true
                                    }),
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.ts$/,
                    include: [
                        sourceRoot
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
                        sourceRoot
                    ],
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            useRelativePath: false,
                            emitFile: true,
                            outputPath: "",
                            publicPath: function (url)  {
                                writeFile("a.txt", url, (err) => {});
                                return url;
                            }
                        }
                    }]
                }
            ];
        this.initConfig.module.rules = this.initConfig.module.rules.concat(baseRules);
        return this;
    }
    export() {
        return this.initConfig;
    }
    copy() {
        let $this = this,
            copyConf = Object.create($this.initConfig);
        return copyConf;
    }
}