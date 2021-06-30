---
title: hello webpack with react
date: 2018-01-27
update: 2019-10-07 16:13:44
tags: [react, webpack]
urlname: how-to-set-correctly-font-family
---

虽然 React 官方有提供一个 create-react-app 的脚手架，并给出了各种在开发过程中需要的扩展配置文档：比如如果你想用 sass，它会教你怎么做，不知道如何部署，它也告诉你了；甚至还告诉你如何用 prettier 去 lint 代码；但本着折腾的精神，也来小小实现一番。

<!--more-->

## 初始化项目

```shell
mkdir React-webpack
cd React-webpack
yarn init -y
```

最后一个命令应该已经生成了一个 package.json 文件。这 -y 表示应该使用所有的默认配置。在 package.json 文件中，您可以找到配置，稍后安装节点包和脚本。

创建主目录

```shell
mkdir build
cd build
```

在 build 目录创建一个 index.html ,内容如下：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>React & Webpack Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="bundle.js"></script>
  </body>
</html>
```

div.root：作为 react 挂载的根节点。
bundle.js：为打包后生成的主要文件，即入口。

## 安装 webpack

我们将使用 webpack 进行打包，webpack-dev-server 进行开发。

切换到根目录：`yarn add --dev webpack webpack-dev-server`
在根目录添加配置文件 `webpack.config.js` ：

```js
const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './src/index.js',
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  devServer: {
    contentBase: './build',
    port: 9000
  }
}
```

然后再 package.json 添加一行：

```json
"start": "webpack-dev-server --progress --colors --config ./webpack.config.js"
```

在 src 目录下添加文件 index.js ：

```js
//src/index.js
console.log('hello')
```

目录结构：

```
- build
- node_modules
- src
-- index.js
-- index.html
- package.json
- webpack.config.js

```

我们现在先来试试 webpack 吧！npm start ,打开浏览器输入 localhost:9000 你将看到控制台打印了 hello ，至此 webpack 基本配置完成。

## 安装 babel / 配置 React

webpack 不可缺少的 babel ,通过 Babel ，代码将被转换回 ES5，以便每个没有实现所有 ES6 功能的浏览器都可以解释它。babel 甚至更进一步。您不仅可以使用 ES6 功能，还可以使用 ES 的下一代功能。

```shell
yarn add --dev babel-core babel-loader babel-preset-env
```

- babel-preset-react
- babel-core：babel 核心；
- babel-preset-env：es6 转 es5 ；
- babel-preset-stage-2：使用更多的实验性功能（例如对象扩展） create-react-app 也有用到；
- babel-preset-react：jsx 转 js。

ok，下面配置 babel，编辑 package.json ，添加：

```json
"babel": {
    "presets": [
      "env",
      "react",
      "stage-2"
    ]
  }
```

配置 webpack-loader，编辑 webpack.config.js ,添加：

```
module: {
  rules: [{
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader']
  }]
}
```

现在所有配置已经完成！！

安装 react 全家桶：yarn add react react-dom
更改 src/index.js:

```js
import React from 'react'
import ReactDOM from 'react-dom'

const Hello = () => <h1>'Hello React、 Webpack'</h1>

ReactDOM.render(<Hello />, document.getElementById('root'))
```

yarn start，现在刷新浏览器你能看到页面显示 `Hello React、 Webpack`!

## 配置热加载

模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。本页面重点介绍实现，而概念页面提供了更多关于它的工作原理以及为什么它有用的细节。
配置热加载能大大减少开发时间。
安装 `yarn add --dev react-hot-loader`
配置 webpack.config.js

```js
entry: ['react-hot-loader/patch','./src/index.js'],
//修改入口文件
  devServer: {
    contentBase: "./build",
    port: 9000,
    hot: true//增加此段
  },
```

更改 src/index.js,在最后添加：

```js
module.hot.accept()
```

再次启动 yarn start.
当你更改 Hell 组件浏览器将会自动刷新为最新结果。

Progressive Web App 支持
yarn add sw-precache-webpack-plugin webpack-manifest-plugin --dev
