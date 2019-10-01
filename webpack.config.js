const path = require('path'),
    webpack = require('webpack'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    ManifestPlugin = require('webpack-manifest-plugin'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');

const isDev = process.env.NODE_ENV === "DEV";

const distPath = path.resolve(__dirname, 'dist/static');

let plugins = [
    new MonacoEditorWebpackPlugin({
        languages: ['cpp', 'go', 'rust', 'swift']
    }),
    new CopyWebpackPlugin([
        {
            from: 'node_modules/es6-shim/es6-shim.min.js',
            to: distPath
        }
    ]),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    }),
    new MiniCssExtractPlugin({
        filename: isDev ? '[name].css' : '[name].[contenthash].css'

    }),
    new ManifestPlugin({
        fileName: path.resolve(__dirname, 'dist/manifest.json'),
        publicPath: ''
    })
];

module.exports = {
    mode: isDev ? 'development' : 'production',
    entry: './static/main.js',
    output: {
        filename: isDev ? '[name].js' : '[name].[chunkhash].js',
        path: distPath
    },
    resolve: {
        modules: ['./static', './node_modules'],
        alias: {
            //is this safe?
            goldenlayout: path.resolve(__dirname, 'node_modules/golden-layout/'),
            lzstring: path.resolve(__dirname, 'node_modules/lz-string/'),
            filesaver: path.resolve(__dirname, 'node_modules/file-saver/')
        }
    },
    stats: 'normal',
    devtool: 'source-map',
    optimization: {
        minimize: !isDev,
        minimizer: [new UglifyJsPlugin({
            parallel: true,
            sourceMap: true,
            uglifyOptions: {
                output: {
                    comments: false,
                    beautify: false
                }
            }
        })]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: path.resolve(__dirname, 'static/themes/'),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './',
                            hmr: isDev
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'static/themes/'),
                use: ['css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=8192'
            },
            {
                test: /\.(html)$/,
                loader: 'html-loader',
                options: {
                    minimize: !isDev
                }
            }
        ]
    },
    plugins: plugins
};
