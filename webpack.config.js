const path = require('path')
const dirBuild = path.resolve(__dirname, 'build')

module.exports = {
  entry: path.resolve(__dirname, './src/main.js'),
  mode: "development",
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
  // Create Sourcemaps for the bundle
  devtool: 'source-map',
  devServer: {
    contentBase: dirBuild
  }
}
