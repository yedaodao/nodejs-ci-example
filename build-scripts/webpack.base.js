const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const _ = require('lodash');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

const util = require('./util');

/**
 * get webpackConfig with env config
 * @param envConfig location: projectRoot/config/index.js
 * @returns {{output: {path}, module: {rules: *[]}, plugins: *[]}}
 */
module.exports = function (envConfig) {
    const assetsSubDirectory = _.get(envConfig, 'assetsSubDirectory');
    const baseConfig = {
        output: {
            filename: util.assetsPath(assetsSubDirectory, 'js/[name].[chunkhash].js'),
            chunkFilename: util.assetsPath(assetsSubDirectory, 'js/[id].[chunkhash].js'),
            path: _.get(envConfig, 'assetsRoot', ''),
            publicPath: _.get(envConfig, 'publicPath', '/')
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            "presets": [
                                [
                                    "env",
                                    {
                                        "targets": {
                                            "browsers": [
                                                "ie >= 9",
                                                "Edge >= 12",
                                                "Safari >4",
                                                "Chrome >= 21",
                                                "Firefox >= 28"
                                            ]
                                        }
                                    }
                                ],
                                "react"
                            ],
                            "plugins": [
                                "transform-object-rest-spread",
                                "add-module-exports",
                                "transform-decorators-legacy",
                                "transform-class-properties",
                            ],
                            "env": {
                                "development": {
                                    "sourceMaps": "inline"
                                }
                            },
                            "comments": false
                        }
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: util.assetsPath(assetsSubDirectory, 'img/[name].[hash:7].[ext]')
                    }
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: true
                                }
                            },
                            'postcss-loader',
                        ],
                        publicPath: util.cdnAssetsPath('/')
                    }),
                },
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: true
                                }
                            },
                            'postcss-loader',
                            {
                                loader: 'less-loader'
                            }
                        ],
                        publicPath: util.cdnAssetsPath('/')
                    }),
                },
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': _.get(envConfig, 'env', {}),
            }),

            // extract css into its own file
            new ExtractTextPlugin({
                filename: util.assetsPath(assetsSubDirectory, 'css/[name].[contenthash].css')
            }),

            // copy custom static assets
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, '../assets'),
                    to: _.get(envConfig, 'assetsSubDirectory', ''),
                    ignore: ['.*']
                }
            ]),
        ]
    };
    // handle backend html
    const pageMap = _.get(envConfig, 'pageMap', []);
    if (!_.isEmpty(pageMap)) {
        pageMap.forEach(function (page) {
            baseConfig.plugins.push(new HtmlWebpackPlugin(page));
        });
    }
    // handle copy assets
    const copyAssets = _.get(envConfig, 'copyAssets', []);
    if (!_.isEmpty(copyAssets)) {
        baseConfig.plugins.push(new CopyWebpackPlugin(copyAssets));
    }

    // handle analyze
    if (_.get(envConfig, 'stats')) {
        baseConfig.plugins.push(
            new StatsPlugin('stats.json', {
                // chunkOrigins: false,
                // modules: false,
                // hash: true,
                // errors: true,
                // errorDetails: false,
                // source: false,
                // reasons: false,
                // warnings: true,
                // chunks: false
            })
        )
    }
    return baseConfig;
}
