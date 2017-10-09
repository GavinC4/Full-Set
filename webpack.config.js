const path = require('path');

// resolveLoader: this is where webpave should look for loaders like babel
//resolve: this is where webpack should look for files referenced by import or require

const config = {
    context: path.join(__dirname, 'src'),
    entry: [
        './app-client.js',
    ],
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel'],
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'url-loader',
                options: {
                    limit: 25000
                }
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
        ],
    },
    resolveLoader: {
        root: [
            path.join(__dirname, 'node_modules'),
        ],
    },
    resolve: {
        root: [
            path.join(__dirname, 'node_modules'),
        ],
    },
};
module.exports = config;