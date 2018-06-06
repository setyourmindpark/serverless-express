const baseWebpack = require('./webpack.config.base');
const path = require('path');
const webpack = require('webpack');
const prodEnv = require('../config/env.config.prod');

baseWebpack.output = Object.assign(baseWebpack.output, {
    path: path.resolve(__dirname, './build'),
    filename: 'prod.bundle.js'
})

baseWebpack.plugins = baseWebpack.plugins.concat([
    new webpack.DefinePlugin({
        buildEnv: JSON.stringify(prodEnv),
    })
])

module.exports = baseWebpack;
