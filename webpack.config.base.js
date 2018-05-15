const CleanPlugin = require('clean-webpack-plugin');
const fs = require('fs');
const rootPath = require('app-root-path').path;
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

function getConfig(env, options) {
    const configuration = {
        devtool: options.mode === 'production' ? undefined : 'source-map',
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
            ],
        },
        plugins: [
            new webpack.BannerPlugin(
                { banner: fs.readFileSync('COPYRIGHT', 'utf8').trim() }
            ),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify((process.env.NODE_ENV || 'development')).toLowerCase(),
                },
            }),
        ],
    };

    if (options.mode === 'production') {
        configuration.plugins.push(
            new CleanPlugin([paths.dist], { verbose: false }),
        );
    }

    return configuration;
}

module.exports = {
    getConfig: getConfig,
    paths: paths,
};
