const path = require('path');

module.exports = {
  entry: path.resolve('javascripts', 'entry.ts'),
  devtool: 'inline-source-map',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
