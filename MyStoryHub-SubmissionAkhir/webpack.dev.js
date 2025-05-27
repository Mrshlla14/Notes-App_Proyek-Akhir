const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: false,
    port: 9001,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
  plugins: [
    // Definisikan NODE_ENV
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
});