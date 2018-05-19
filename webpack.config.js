const rootPath = require('app-root-path').path;
const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const HtmlPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

const paths = {
    assets: `${rootPath}/src/assets`,
    dist: `${rootPath}/dist`,
    dotenv: `${rootPath}/.env`,
    electronMain: `${rootPath}/src/main.ts`,
    electronRenderer: `${rootPath}/src/renderer.ts`,
    favicon: `${rootPath}/public/favicon.ico`,
    html: `${rootPath}/public/index.html`,
    index: `${rootPath}/src/index.tsx`,
    nodeModules: `${rootPath}/node_modules`,
    packageJson: `${rootPath}/package.json`,
    public: `${rootPath}/public`,
    src: `${rootPath}/src`,
    tsConfigJson: `${rootPath}/tsconfig.json`,
    tsLintJson: `${rootPath}/tslint.json`,
};

module.exports = (env, options) => {
    const configuration = {
        devtool: options.mode === 'production' ? undefined : 'source-map',
        entry: [
            paths.index
        ],
        target: 'electron-main',
        output: {
            path: paths.dist,
            filename: '[name].ui.js',
        },
        resolve: {
            modules: [
                paths.nodeModules,
            ],
            extensions: [
                '.js',
                '.json',
                '.jsx',
                '.ts',
                '.tsx',
                '.web.js',
                '.web.jsx',
                '.web.ts',
                '.web.tsx',
            ],
        },
        performance: {
            hints: false,
        },
        stats: {
            children: false,
            modules: false,
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    include: paths.src,
                    loader: 'ts-loader',
                    options: {
                        configFile: paths.tsConfigJson
                    },
                },
                {
                    test: /\.js$/,
                    loader: 'source-map-loader',
                    enforce: 'pre',
                    include: paths.src,
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
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
                    test: /ReactToastify\.min\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[local]',
                            },
                        }
                    ]
                },
                {
                    test: /(bmp|gif|ico|jpe?g|pdf|png|svg|woff2?)$/,
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
                { from: `${paths.public}/*.png`, flatten: true }
            ]),
            new HtmlPlugin({
                favicon: paths.favicon,
                inject: true,
                template: paths.html,
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
                filename: '[name].ui.css',
                chunkFilename: '[id].css',
                verbose: false,
            }),
            new webpack.BannerPlugin(
                { banner: fs.readFileSync('COPYRIGHT', 'utf8').trim() }
            ),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify((process.env.NODE_ENV || 'development')).toLowerCase(),
                },
            }),
            new webpack.NamedModulesPlugin(),
            new webpack.WatchIgnorePlugin([
                /css\.d\.ts$/,
            ]),
        ],
    };

    if (options.mode === 'production') {
        configuration.plugins.push(
            new CleanPlugin([paths.dist], { verbose: false }),
            new OptimizeCSSAssetsPlugin(),
        );
    }

    return configuration;
}
