const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new webpack.DefinePlugin({
    __PROXY_BASE_URL__: JSON.stringify(process.env.PROXY_BASE_URL || "http://localhost:8000/")
  })
];
