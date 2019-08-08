# Webpack Loader

Webpack Loader 就像一个翻译员，能够把源文件经过转换后输出新的结果。并且，一个文件还可以链式的经过多个翻译员翻译。当源文件经过一组 loader 处理时，第一个 loader 会拿到原内容，将处理完的文件传递给下一个 loader，作为输入。以此类推，直到最后一个 loader 处理完毕后，将最终结果返回给 webpack。

因此在编写一个 Loader 时要注意保持职责的单一性，只需要关心输入和输出。

## Loader 基础

由于 Webpack 是运行在 Node.js 上的，一个 Loader 其实就是一个 Node.js 模块。这个模块需要导出一个函数。 这个导出的函数的工作就是获得处理前的原内容，对原内容执行处理后，返回处理后的内容。

Loader 函数可以使用 node 任何自带的 API，也可以引入第三方 node 模块。

下面是一个 Loader 的模版：

```javascript
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件原内容
  // 该函数需要返回处理后的内容
  return source;
};
```

## Loader 进阶

### 获得 Loader 的 options

借助 [loader utils](https://github.com/webpack/loader-utils) 来获取 Loader 的 options。

通过 `getOptions()` 方法获取 options。

```javascript
const loaderUtils = require('loader-utils');

module.exports = function(source) {
  const options = loaderUtils.getOtions(this);
  return source;
};
```

### 返回其他结果

普通情况下，一个同步 loader 会简单返回一个代表模块转化后的值。也可以通过 `this.callback(err, values, ...)` 返回任意数量的值。具体参考：[this.callback API](https://webpack.docschina.org/api/loaders/#this-callback)

比如 babel-loader 在处理完 ES6 代码后，还需要输出转换为 ES5 的 source map，于是可以这样写：

```javascript
module.exports = function(source) {
  this.callback(null, source, sourceMaps);
  // 当通过 this.callback 返回输出时，该 loader 必须返回 undefined。
  return;
};
```

### 同步与异步

当 loader 需要使用异步的方式加载时，可以使用 webpack 提供的 `this.async()` 方法：

```javascript
module.exports = function(source) {
  // 告诉 webpack 本次转换是异步的，loader 会在 callback 中回调结果。
  const callback = this.async();
  // callback 不存在 -> 返回同步结果
  if (!callback) {
    /*...*/
  }
  someAsyncOperation(source, function(err, result, sourceMaps, ast) {
    // 通过 callback 返回异步执行后的结果
    callback(err, result, sourceMaps, ast);
  });
};
```

### 处理二进制文件

通常情况下 webpack 传给 loader 的都是 UTF-8 格式的字符串，但比如 file-loader 就是处理二进制文件的。这时就需要 webpack 给 loader 传入二进制文件。

```javascript
module.exports = function(source) {
  // 在 exports.raw === true 时，Webpack 传给 Loader 的 source 是 Buffer 类型的
  source instanceof Buffer === true;
  // Loader 返回的类型也可以是 Buffer 类型的
  // 在 exports.raw !== true 时，Loader 也可以返回 Buffer 类型的结果
  return source;
};

// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据
module.exports.raw = true;
```

### 缓存加速

在某些情况下，有些转换需要做大量的计算操作，非常耗时。webpack 会默认开启缓存，以加快构建。使用这样关闭缓存：

```javascript
module.exports = function(source) {
  // 关闭该 Loader 的缓存功能
  this.cacheable(false);
  return source;
};
```

### 其他 API

其他 API 参考官网：https://webpack.docschina.org/api/loaders/

## Loader 优化相关
