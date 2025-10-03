const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var webpack = require('webpack');

module.exports = {
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    entry: {
        main:{
            import: path.join(__dirname, "ClientApp", "main.ts"),
            library: {
                type: "module"
            },
        }        
    },
    output: {
        path: path.resolve(__dirname, "wwwroot/app"),
        filename: "[name].js",
        //filename: "[name].[chunkhash].js",
        publicPath: "/_content/PrecisionFarms/app/",
        libraryTarget: 'module',
        assetModuleFilename: 'images/[hash][ext][query]'
    },
    experiments: {
        outputModule: true
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    // PostCSS
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                precision: 10,
                                plugins: [
                                    require('autoprefixer')(),
                                    require('postcss-calc')()
                                ]
                            }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            // Prefer `dart-sass`
                            implementation: require.resolve("sass"),
                            sassOptions: {
                                indentWidth: 4,
                                precision: 10,
                                includePaths: ["./ClientApp"]
                            },
                        },
                    }]
            },
            // For webpack v5
            {
                test: /\.(png|jpe?g|gif)$/i,
                // More information here https://webpack.js.org/guides/asset-modules/
                type: "asset"
            },
        ]
    },
    //optimization: {
    //    splitChunks: {
    //        cacheGroups: {
    //            defaultVendors: {
    //                filename: '[name].js',
    //            },
    //            vendor: {
    //                test: /[\\/]node_modules[\\/](quill|kendo-ui-core|bootstrap|tinymce)[\\/]/,
    //                name: 'vendor',
    //                chunks: 'all',
    //            },
    //            tinymceVendor: {
    //                test: /[\\/]node_modules[\\/](tinymce)[\\/](.*js|.*skin.css)|[\\/]plugins[\\/]/,
    //                name: 'tinymce'
    //            }
    //        },
    //    }
    //},
    plugins: [
        new webpack.ProvidePlugin({
            // $: 'jquery',
            // jQuery: 'jquery',
            
            'window.kendo': 'kendo-ui-core',
            
        }),
        //new ArcGISPlugin(),
        new CleanWebpackPlugin(),
        //new HtmlWebpackPlugin({
        //    template: "./src/index.html"
        //}),
        new MiniCssExtractPlugin({
            filename: "[name].css"
            //filename: "css/[name].[chunkhash].css"
        })
    ]
};