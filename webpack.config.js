const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge')
const fs = require('fs');

const baseConfig = require('./webpack.config.base');

module.exports = (env, options) => {
    const configuration = {
        entry: [
            baseConfig.paths.index
        ],
        devServer: {
            contentBase: baseConfig.paths.dist,
            compress: true,
            historyApiFallback: true,
            open: false,
            port: 9999,
        },
        target: 'electron-main',
        output: {
            path: baseConfig.paths.dist,
            filename: '[name].bundle.js',
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'typings-for-css-modules-loader',
                            options: {
                                modules: true,
                                camelCase: true,
                                namedExport: true,
                                localIdentName: '[name]_[local]_[hash:base64:5]',
                            },
                        }
                    ]
                },
                {
                    test: /(bmp|gif|ico|jpe?g|pdf|png|svg)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
            ]
        },
        plugins: [
            new CopyPlugin([
                { from: baseConfig.paths.assets }
            ]),
            new webpack.NamedModulesPlugin(),
            new webpack.WatchIgnorePlugin([
                /css\.d\.ts$/,
            ]),
            new HtmlPlugin({
                favicon: baseConfig.paths.favicon,
                inject: true,
                template: baseConfig.paths.html,
                minify: options.mode === 'development'
                    ? undefined
                    : {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                    }
            }),
            new InterpolateHtmlPlugin({
                PUBLIC_URL: '',
            }),
            new MiniCssExtractPlugin({
                filename: '[name].bundle.css',
                chunkFilename: '[id].css',
            })
        ],
    };

    if (options.mode === 'production') {
        configuration.plugins.push(
            new OptimizeCSSAssetsPlugin(),
        );
    }

    return merge(baseConfig.getConfig(env, options), configuration);
}
