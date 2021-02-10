//@ts-check
'use strict';
const path = require('path');
module.exports = {
    entry: './src/client/builder.ts',
    output: {
        filename: 'prototype-builder.min.js',
        path: path.resolve(__dirname, 'bundle/client')
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    optimization: {
        minimize: false
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