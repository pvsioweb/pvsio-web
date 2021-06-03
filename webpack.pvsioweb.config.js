//@ts-check
'use strict';
const path = require('path');
module.exports = {
    entry: [ './dist/client/pvsioweb.js' ],
    output: {
        filename: 'pvsioweb.min.js',
        path: path.resolve(__dirname, 'bundle/client'),
        libraryTarget: "var",
        library: "pvsioweb"
    },
    devtool: 'source-map',
    resolve: {
        extensions: [ '.js' ]
    },
    optimization: {
        minimize: true
    },
    performance: {
        maxAssetSize: 400000,
        maxEntrypointSize: 400000,
        hints: "warning"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
            }
        ]
    },
    mode: "production"
};