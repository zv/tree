require('babel-polyfill');
var path = require('path');
var dir_js = path.resolve(__dirname, 'src');
var dir_build = path.resolve(__dirname, 'build');

module.exports = {
    entry: path.resolve(dir_js, 'main.js'),
    output: {
        libraryTarget: 'var',
        library: 'ZVTree',
        path: dir_build,
        filename: 'zv-tree.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: dir_js,
            }
        ]
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
    devServer: {
        contentBase: dir_build
    },
};
