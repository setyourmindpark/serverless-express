const baseWebpack = require('./webpack.config.base');
const path = require('path');
const webpack = require('webpack');
const devEnv = require('../config/env.config.dev');
const MinifyPlugin = require('babel-minify-webpack-plugin');

baseWebpack.output = Object.assign(baseWebpack.output, {
    path: path.resolve(__dirname, './build'),
    filename: 'dev.bundle.js',
})

baseWebpack.plugins = baseWebpack.plugins.concat([
    new MinifyPlugin(),
    new webpack.DefinePlugin({
        buildEnv: JSON.stringify(devEnv),
    }),
])

module.exports = baseWebpack;
