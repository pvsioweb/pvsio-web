//@ts-check
'use strict';
const path = require('path');
module.exports = {
    entry: './src/client/bundle.ts',
    output: {
        filename: 'pvsioweb.min.js',
        path: path.resolve(__dirname, 'bundle/client')
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
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