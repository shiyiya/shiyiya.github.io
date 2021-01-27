---
title: 我的 Webpack（4）升级指南
date: 2018-09-20
update: 2019-10-07 17:56:19
tags: webpck4
photos:
  - https://i.loli.net/2018/09/20/5ba2754ee0772.png
---

全新的 webpack（4）来了，带来了全新的特性，更快的性能，更少的配置，先来升级踩波坑吧！

<!--more-->

## 升级 webpack

直接卸载重装最新！

```shell
yarn remove webpack webpack-dev-server
yarn add webpack webpack-cli
```

webpack 4 必须安装 CLI

官方的介绍是这样的：
不安装将会报 error。

## 修改配置

### 添加 mode

webpack 默认提供 mode 选项
值为 development(开发环境) || production(生产环境)
不需要自行判断是生产环境还是开发环境，直接在配置下增加字段。
development：默认启用 热加载/缓存 等。
production： 默认启用代码压缩等功能。
`mode: development || production`

### CommonsChunkPlugin 的弃用

```js
// webpack3
new webpack.optimize.CommonsChunkPlugin({
      names: ['common','vendor'],
      filename: './common/[name].bundle.js',
      minChunks: 2,
  })

// webpack4
  optimization: {
    minimize: true,
    splitChunks: {
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      minChunks: 2,
      cacheGroups: {
        default: false,
        commons: {
          filename: './commons/[name].[hash:8].js',
          name: "commons",
          chunks: "initial",
          minChunks: 2
        },
      vendor: {
        test: /node_modules/,
        filename: './vendor/[name].[hash:8].js',
        name: "vendor",
        chunks: "initial",
        minChunks: 1
      }
    }
  }
}
```

### extract-text-webpack-plugin 将不再支持

改用 MiniCssExtractPlugin 这个插件,具体内如可查看官方 Issue 。

```
yarn add mini-css-extract-plugin
```

配置如下：

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

plugins:[
  ...
  new MiniCssExtractPlugin({
        filename: "./css/[name].[hash:8].css",
        //chunkFilename: "[name].css"
      })
]
....
modules: {
  ....
  rules: [
    {
    test: /\.css$/,
    use: [{
      loader: MiniCssExtractPlugin.loader,
      options: {
        //因为上面设置了 /css/ 目录
        //Issue：https://github.com/webpack-contrib/mini-css-extract-plugin/issues/44#issuecomment-379059788
        publicPath: '../'
      }
    },
    {
      loader: 'css-loader',
        options: {
          minimize: true,
          outputPath: './css/',
        }
    },
    {loader: 'postcss-loader'},
  }]
}
```

## 总结

webpack4 官方 [CHANGELOG](https://github.com/webpack/webpack/releases)

1. entry ：默认为 src/index
2. output：默认为 dist
3. 新增 mode：为 production 和 development （必选）
4. 默认热加载
5. 新增 cli
6. 生产环境默认开启了很多代码优化（ minify，splite 等),即不需要 UglifyJsPlugin
7. CommonsChunkPlugin 删除，改用 optimization.splitChunks
