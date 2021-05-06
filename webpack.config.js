require('@babel/polyfill');
var path = require('path');
var dir_build = path.resolve(__dirname, 'build');

module.exports = {
    entry: path.resolve(__dirname, './src/main.js'),
    output: {
        libraryTarget: 'var',
        library: 'ZVTree',
        path: dir_build,
        filename: 'zv-tree.js'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            }
        ]
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
    devServer: {
        contentBase: dir_build
    },
};
