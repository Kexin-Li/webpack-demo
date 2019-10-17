const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const jsLoader = {
  test: /\.js$/,
  include: path.resolve(__dirname, 'src'),
  use: ['babel-loader']
};

const lessLoader = {
  test: /\.less$|\.css$/,
  include: path.resolve(__dirname, 'src'),
  use: [
    // mini-css-extract-plugin 只能在 production 模式下使用
    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    'less-loader'
  ]
};

module.exports = {
  entry: { bundle: './src/index.js' },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [jsLoader, lessLoader]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'demo',
      template: './index.html'
    }),
    // this plugin should be only used on production build
    // and without `style-loader` in the loaders chain
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    })
  ],
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  }
};
