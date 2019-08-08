const path = require('path');

const jsLoader = {
  test: /\.js$/,
  include: path.resolve(__dirname, 'src'),
  use: [
    'babel-loader?cacheDirectory',
    {
      loader: './loader/simpleLoader.js',
      options: {
        一: 'one',
        二: 'two'
      }
    },
    {
      loader: './loader/replaceImportLoader.js',
      options: {
        lib: 'antd'
      }
    }
  ]
};

const lessLoader = {
  test: /\.less$|\.css$/,
  // exclude: path.resolve(__dirname, 'node_modules'),
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'less-loader',
      options: {
        javascriptEnabled: true
      }
    }
  ]
};

module.exports = {
  module: {
    rules: [jsLoader, lessLoader]
  }
};
