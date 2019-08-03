const path = require('path');

const jsLoader = {
  test: /\.js$/,
  include: path.resolve(__dirname, 'src'),
  use: ['babel-loader?cacheDirectory']
};

const lessLoader = {
  test: /\.less$|\.css$/,
  exclude: path.resolve(__dirname, 'node_modules'),
  use: ['style-loader', 'css-loader', 'less-loader']
};

module.exports = {
  module: {
    rules: [jsLoader, lessLoader]
  }
};
