const path = require('path')
const dirBuild = path.resolve(__dirname, 'build')
var config = {
  entry: path.resolve(__dirname, './src/main.js'),
  mode: 'development',
  output: {
    libraryTarget: 'var',
    library: 'ZVTree',
    path: dirBuild,
    filename: 'zv-tree.js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  devServer: {
    contentBase: dirBuild
  }
}

module.exports = (env, argv) => {
    if (argv.mode !== 'production') {
        config.devtool = 'source-map';
    }

    return config;
}

