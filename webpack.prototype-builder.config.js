//@ts-check
'use strict';
const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
    entry: './src/client/builder.min.ts',
    output: {
        filename: 'prototype-builder.min.js',
        path: path.resolve(__dirname, 'bundle/client')
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    mangle: true,
                    compress: true,
                    keep_fnames: false,
                    keep_classnames: true
                }
            })
        ]
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