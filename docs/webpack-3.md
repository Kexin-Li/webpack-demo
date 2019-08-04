# Webpack 优化篇

优化分为优化开发体验和优化输出质量两部分。

## 优化开发体验

目的在于提升开发效率。

1. 优化构建速度
   - 缩小文件搜索范围
   - 使用 DllPlugin
   - 使用 HappyPack
   - 使用 ParallelUglifyPlugin
2. 优化使用体验
   - 使用自动刷新
   - 开启模块热更新

### 缩小文件搜索范围

Webpack 从 Entry 出发，递归解析文件。在遇到导入语句时 webpack 会做两件事：

1. 根据导入语法查找文件。
2. 根据找到的文件后缀，使用 Loader 处理文件。

优化方向：

1. 尽快找到文件
2. Loader 处理尽量少的文件

优化方法：

1. 优化 Loader 配置，使用 include, exclude 配置项缩小处理的文件范围。
2. 优化 `resolve.modules` 配置，给定 node_modules 的绝对路径。
3. 优化 `resolve.mainFields` 配置，给定用于 target 坏境的入口文件。在 tp-camp 中，由于服务端和客户端都用的同一份 webpack 配置，所以这个配置项没法优化。
4. 优化 `resolve.extensions` 配置，一是 extensions 配置列表不宜过长，因为越长会造成尝试的次数越多；二是频率出现最高的文件后缀要优先放前面；三是在导入语句时要尽可能带上后缀。
5. 优化 `module.noParse` 配置，完整的 `react.min.js` 就没有采用模块化，因此可以忽略对 `react.min.js` 的解析。

### 使用 DllPlugin【回头再看】

// TODO

### 使用 HappyPack

使用 HappyPack 能够让 webpack 发挥多核 CPU 电脑的威力，在同一时刻处理多个任务，提高构建速度。

HappyPack 把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。由于 JavaScript 是单线程模型，因此想要发挥多核 CPU 的能力，只能通过多进程去实现，而无法通过多线程实现。

### 使用 ParallelUglifyPlugin

使用 ParallelUglifyPlugin 是为了使用多进程并行压缩代码，是 UglifyJS 的多进程版本。使用 ParallelUglifyPlugin 处理多个 JavaScript 文件时，会开启多个子进程，把对多个文件的压缩工作分配给多个子进程去完成，每个子进程还是通过 UglifyJS 去压缩代码，但是变成了并行去执行。

What’s different between `webpack-parallel-uglify-plugin` and `uglifyjs-webpack-plugin` parallel option.

## 优化输出质量

目的在于给用户呈现体验更好的网页。优化输出质量的本质是优化构建输出的要发布到线上的代码。

1. 减少用户能感知的加载时间，即首屏加载时间。
   - 区分环境
   - 压缩代码
   - CDN 加速
   - 使用 Tree Shaking
   - 提取公共代码
   - 按需加载
2. 提升流畅度
   - 使用 Prepack
   - 开启 Scope Hoisting

### CDN 加速

CDN 的作用就是加速网络传输，减少用户在首次打开网页时的加载等待。
