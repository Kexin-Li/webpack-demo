const loaderUtils = require('loader-utils');

module.exports = function(source) {
  const options = loaderUtils.getOptions(this);

  // 将源文件中所有 options 中的 key 替换为 options 中对应的 value
  for (let key in options) {
    const regex = new RegExp(key, 'gi');
    source = source.replace(regex, options[key]);
  }

  return source;
};
