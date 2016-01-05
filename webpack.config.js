module.exports = {
  context: __dirname,
  entry: './src/main',
  output: {
    path: __dirname + '/dist/',
    filename: 'martinetto.js',
    library: 'martinetto',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /^\.\/node_modules.*/,
        loader: 'babel'
      }
    ]
  }
}
