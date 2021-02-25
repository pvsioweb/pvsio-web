//@ts-check
'use strict';
const path = require('path');
module.exports = {
    entry: [ 'babel-polyfill', './dist/client/pvsioweb.js' ],
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
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ]
    },
    mode: "production"
};