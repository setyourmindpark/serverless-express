const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './app.js'),
    target: 'node',
    stats: {
        warnings: false
    },    
    node: {
        global: true        
    },
    output: {
        libraryTarget: 'umd'
    },
    resolve: {
        alias: { '@root': path.resolve(__dirname, '../') },
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.node$/,
                use: 'node-loader'
            },
        ],
    },
    plugins: [],
};