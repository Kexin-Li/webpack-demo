# React 工程搭建

## babel & webpack

babel:

- `@babel/core`
- `babel-loader`
- `@babel/preset-env`
- `@babel/preset-react`

webpack:

- `webpack`
- `webpack-cli`
- `webpack-dev-server`

## Loader 配置

- **loader 做了什么**：类似于翻译员，将 webpack 不能识别的文件类型(除 js 以外的文件)转换为能识别的文件类型。
- **如何配置 loader**：`test` 属性指定命中文件，`use` 属性指定使用哪种 loader 来转换命中文件。
- **loader 解析规则**：loader 支持链式传递，如果有多个 loader，将按照从右往左的顺序进行解析。上一个 loader 解析的结果将作为输入传入下一个 loader。

js:

```js
const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: ['babel-loader']
};
```

css:

- `less-loader`：将 less 文件处理成 css 文件
- `css-loader`：解析 css 文件
- `style-loader`：将 css 注入进 js 文件

```js
const lessLoader = {
  test: /\.less$|\.css$/,
  use: ['style-loader', 'css-loader', 'less-loader']
};
```

使用 `mini-css-extract-plugin` 这个插件来将 css 代码从 js 中抽离出来，形成单独的文件。同时使用 `terser-webpack-plugin` 和`optimize-css-assets-webpack-plugin`两个插件来优化压缩 css 代码。

```js
plugins: [
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
```

## DevServer(回头详细了解下)

DevServer 会启动一个 http 服务器用于网页请求，同时会帮助启动 webpack，接收 webpack 发出的文件变更信号，通过 WebSocket 协议自动刷新网页做到实时预览。

有了 DevServer，我们在开发中可以完成：

1. 提供 HTTP 服务器而不是使用本地文件预览。
2. 监听文件的预览并做到自动刷新，完成实时预览。
3. 支持 source map，方便调试。

### 自动刷新

webpack 会以配置文件中的 entry 作为入口，递归解析 entry 所依赖的文件，并把这些文件加入监听列表中。如果监听列表中的文件改变了，webpack 会重新构建并在构建完成后通知 DevServer，这时 DevServer 会在构建完成的 JS 文件中注入一个代理客户端。这个代理客户端的作用是让 DevServer 和网页通过 WebSocket 来实现通信。

另一种实现实时预览的方式为模块热替换，是在不完全加载整个网页的情况下，通过使用更新过的模块替换老的模块来实现实时预览。在启动 webpack 时加上 `--hot` 启动。

## 支持 source map

在启动 webpack 时加上 `--devtool source-map` 启动。
