# Webpack 配置篇

Webpack 是一个构建工具。由于 web 技术发展迅速，我们已经从原来的 jquery 这种命名空间编程方式走向了模块化的编程之路，以及各种框架的诞生，使得构建工具的应运而生。

构建工具所做的事就是将模块化编程的代码转换成能够直接部署上线执行的 HTML、CSS、JavaScript 代码。

包括如下内容：

1. 代码转换：TypeScript 编译成 JavaScript、SCSS 编译成 CSS 等。
2. 文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片等。
3. 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。
4. 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
5. 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。
6. 代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
7. 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。

## 几个核心概念

- Entry：输入。
- Module：模块。在 webpack 中一切皆模块，一个模块就是一个文件。webpack 会从 Entry 递归找出所有依赖的模块。
- Chunk：代码块。一个 Chunk 由多个模块组合而成，用于代码的合并与分割。
- Loader：模块转换器。用于将模块原内容转换为需要的新内容。
- Plugin：扩展插件。在 webpack 的构建流程中的特定时机注入扩展逻辑来改变构建结果。
- Output：输出。

## Webpack 构建流程

1. 首先 Webpack 根据 Entry 配置的入口模块，递归的找出所有依赖的模块。
2. 接着依次使用配置的 loader 解析这些模块，生成新的模块。然后根据一个入口为一组，将这些模块整合为一个 Chunk。
3. 最后 Webpack 会把所有 Chunk 转换为文件输出。

在整个构建流程中，Webpack 会在恰当的时候去执行 Plugin 里的逻辑。

## Entry

- context：不明白这是干什么的。不明白什么叫逃离 CMD。
- Entry 类型： - 字符串 `string` - 字符串数组 `[string]` - 对象 `object {<key>: string | [string]}` - 返回上述三种类型的函数，可以是同步函数也可以是异步函数。

## Output

output 是一个 Object，里面有如下配置项：

- filename：配置输出文件的名称，为 string 类型。可写死也可配置成 hash 后的名称。
- chunkFilename：配置无入口的 Chunk 在输出时的文件名称。比如懒加载的模块。
- path：配置输出文件存放在本地的目录，必须是绝对路径。
- publicPath：配置发布到线上资源的 URL 前缀，为 string 类型。
- crossOriginLoading：Webpack 输出的代码如果需要异步加载，而异步加载是通过 JSONP 实现的。JSONP 的原理是动态地向 HTML 中插入一个 script 标签去异步加载资源。这一项是用于配置异步插入的这个标签的 croseorigin 值。通常用设置 crossorigin 来获取异步加载的脚本执行时的详细错误信息。【不是很明白这是在干嘛】
- libraryTarget 和 library：【不是很明白这是在干嘛】
- libraryExport：【不是很明白这是在干嘛】

## Module

- rules
- noParse
- parser
- …

### Loader

Module 模块主要用来配置 Loader。具体来说配置在 Module 的 rules 模块中。配置规则如下：

1. **条件匹配**：通过 `test` ，`include` ，`exclude` 三个配置项来命中 Loader 需要处理的文件。
2. **应用规则**：通过 `use` 配置项来给命中文件应用 Loader。可以只应用一个 Loader，也可以应用一组 Loader。也可以给 Loader 传参数，可以是 query 的方式传，也可以是 options 对象的方式传。
3. **执行顺序**：当应用了一组 Loader 时，默认的执行顺序是从右到左。也可以使用 `enforce` 选项来让其中一个 Loader 的执行顺序放到最前面或者最后面。

```javascript
const jsLoader = {
  test: /\.js$/,
  include: path.resolve(__dirname, 'src'),
  use: ['babel-loader?cacheDirectory']
};
```

### noParse

这一项可以让 Webpack 忽略对没有采用模块化编程的文件的递归解析和处理，从而提高构建性能。因此被忽略的文件不应该包括 import，require，define 等模块化语句。

比如忽略 jquery：

```javascript
module: {
  noParse: /jquery/;
}
```

### parser

parser 属性能够更细粒度的配置哪些模块语法要解析，哪些不解析。和 noParse 配置项的区别是 parser 精确到语法，noParse 只精确到文件。

## Resolve

Resolve 配置了 Webpack 如何寻找模块所对应的文件。

### alias

该配置项通过别名来把原导入路径映射成一个新的导入路径。

### mainFields

有的第三方类库会根据不同环境提供几份代码，比如在 ant-design 组件库的 package.json 文件中指定了 ES5 和 ES6 的入口地址：
[image:7C73A893-BB58-41E3-9B15-F73986CC117B-762-00000150136FDC53/4F77D9FF-66B3-4097-8E92-00F277125F5B.png]

webpack 在没有配置 target 属性，或者 target 属性配置为 webworker 或者 web 时的 mainFields 默认值为：

```javascript
mainFields: ['browser', 'module', 'main'];
```

当 target 配置为 node 时的 mainFields 为：

```javascript
mainFields: ['module', 'main'];
```

### extensions

在导入语句没有带文件后缀时，webpack 会根据 extensions 配置项来给文件自动带上后缀，再去尝试访问文件是否存在。例如有如下配置：

```javascript
extensions: ['.js', '.vue', '.json'];
```

当 webpack 遇到 `import xx from 'xx'` 时，首先会去寻找 `xx.js` 文件，如果不存在就去寻找 `xx.vue` 文件，以此类推。

### modules

配置了 webpack 应该去哪些目录下寻找第三方模块，默认的只会去 `node_modules` 目录下寻找。例如有如下配置：

```javascript
modules: ['./src/components', 'node_modules'];
```

当 webpack 遇到 `import button from 'button'` 时会优先去 `./src/components` 目录下搜索，如果没找到再去 node_modules 搜索。

【🤔️ 疑问来了】
那这个 modules 配置项和 alias 配置项有啥区别？可能实现的方式不一样，比如 alias 是解析到 import 语句时将目标路径替换成别名路径，而 modules 配置的是解析到 import 语句时搜索文件的方式。但我觉得他们最终达到的效果是一样的。

那我该什么时候用 alias 什么时候用 modules？

### enforceExtension

enforceExtension 如果配置为 true，那么所有导入的语句都必须要带文件后缀。

### enforceModuleExtension【不明白这是要干嘛】

enforceModuleExtension 和 enforceExtension 作用类似，但 enforceModuleExtension 只对 node_modules 下的模块生效。enforceModuleExtension 通常搭配 enforceExtension 使用，在
enforceExtension:true 时，因为安装的第三方模块中大多数导入语句没带文件后缀， 所以这时通过配置 enforceModuleExtension:false 来兼容第三方模块。

## Plugin

Plugin 用于扩展 webpack 的功能。

Webpack 接入 plugin 很简单，就是在 plugins 配置项中传入数组，数组的每一项都是一个 plugin 实例。难点在于搞懂 plugin 本身提供的配置项。

## devServer【回头细看】

在配置文件中配置 `devServer` 项可以改变 DevServer 的默认行为。同时，由于这些功能都是 DevServer 提供的，webpack 并不认识他们。因此，只有在使用了 DevServer 去启动 Webpack 时这些配置才会生效。

何为 DevServer？DevServer 的存在是为了提高开发效率。DevServer 会启动一个 http 服务器用于网页请求，同时会帮助启动 webpack，接收 webpack 发出的文件变更信号，通过 WebSocket 协议自动刷新网页做到实时预览。

有了 DevServer，我们在开发中可以完成：

1. 提供 HTTP 服务器而不是使用本地文件预览。
2. 监听文件的预览并做到自动刷新，完成实时预览。
3. 支持 source map，方便调试。

### hot

`hot` 配置能够启动模块热更新功能。即：当模块更新时不用刷新整个网页，而只替换掉更新的模块来达到实时预览的效果。

### inline

inline 配置项用于配置实时预览功能采用哪种方式。如果开启，则会在页面注入一个代理客户端，通过 DevServer 与客户端的沟通来实时刷新页面。如果关闭，则会通过 iframe 的方式运行网页，当构建完成时通过刷新 iframe 来实现实时预览。默认开启。

### historyApiFallback【不明白这要干嘛】

### contentBase【不明白这要干嘛】

## 其他配置项

### target

JS 代码目前能运行的环境越来越多，从浏览器到 Node.js，这些运行在不同环境中的 JS 代码存在一些差异，配置 target 可以让 webpack 构建出针对不同环境的代码。target 可选为：

- web
- node
- async-node
- webworker
- electron-main
- electron-renderer

### DevTool

devTool 配置了 webpack 如何生成 source map，默认是 false。

### Externals

Externals 用来告诉 webpack 要构建的代码中哪些模块不用打包。

## 总结

- 想让源文件加入到 webpack 构建流程中，配置 `Entry` 。
- 想自定义输出文件的位置和名称，配置 `output` 。
- 想自定义寻找依赖模块时的策略，配置 `resolve` 。
- 想自定义解析和转换的策略，配置 `module` ，通常是配置 `module.rules` 里的 Loader。
- 其他大部分功能，需要通过 Plugin 实现，配置 `plugin` 。
