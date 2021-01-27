---
title: 初探 Progressive Web App
date: 2019-05-18
update: 2019-10-05 09:44:35
tags: pwa
photos:
  - https://i.loli.net/2018/09/19/5ba272239cbdf.png
---

## 它是什么 ？

Progressive Web App, 简称 PWA，是提升 Web App 的体验的一种新方法，能给用户（类）原生应用的体验。

PWA 的主要特点:

- 可靠 - 即使在不稳定的网络环境下，也能瞬间加载并展现
- 体验 - 快速响应，并且有平滑的动画响应用户的操作
- 粘性 - 像设备上的原生应用，具有沉浸式的用户体验，用户可以添加到桌面

<!--more-->

## 创建 Web App Manifest

PWA 添加至桌面的功能实现依赖于 manifest.json，所以我们首先来创建它。

用于添加到桌面的描述等，提升 PWA 从主屏幕启动时的应用体验。
如：

```json
{
  "short_name": "短名称", //用于主屏幕显示
  "name": "这是一个完整名称", //用于安装横幅显示
  "background_color": "#0000ff", //启动背景颜色
  "display": "standalone", //启动显示类型
  "theme_color": "blue", //主题颜色, 启动画面上状态栏、内容页中状态栏、地址栏的颜色，会被 theme_color 所影响。
  "icons": [
    {
      "src": "images/icon/icon-48.png",
      "type": "image/png",
      "sizes": "48x48"
    },
    {
      "src": "images/icon/icon-64.png",
      "sizes": "64x64"
    },
    {
      "src": "images/icon/icon-114.png",
      "type": "image/png",
      "sizes": "114x114"
    },
    {
      "src": "images/icon/icon-128.png",
      "type": "image/png",
      "sizes": "128x128"
    }
  ],
  "start_url": "/?from=pwa"
}
```

应用安装提醒
浏览器在 PWA 站点满足以下条件时会自动显示横幅，提醒你将站点添加到桌面：

- 站点部署 manifest.json，该文件需配置如下属性：

  - short_name （用于主屏幕显示）
  - name （用于安装横幅显示）
  - icons （其中必须包含一个 mime 类型为 image/png 的图标声明）
  - start_url （应用启动地址）
  - display （必须为 standalone 或 fullscreen）

- 站点注册 Service Worker。
- 站点支持 HTTPS 访问。
- 站点在同一浏览器中被访问至少两次，两次访问间隔至少为 5 分钟
- 如果满足以上条件浏览器也提供了一些事件接口供网站开发者使用。

### 判断用户是否安装此应用

beforeinstallprompt 事件返回一个名为 userChoice 的 Promise 对象，并在当用户对横幅进行操作时进行解析。promise 会返回属性 outcome，该属性的值为 dismissed 或 accepted，如果用户将网页添加到主屏幕，则返回 accepted。

```javascript
window.addEventListener('beforeinstallprompt', function (e) {
  e.userChoice.then(function (choiceResult) {
    if (choiceResult.outcome === 'dismissed') {
      console.log('用户取消安装应用')
    } else {
      console.log('用户安装了应用')
    }
  })
})
```

## 添加离线缓存

PWA 主要解决的就是离线访问，即使再没网的情况下也能查看之前访问过的资源，实现这些功能可以使用 indexDB，service worker，localstorage 等，下面我们使用 SW 实现。

## 什么是 Service Worker

基于 Cache API 实现，主要用来做持久的离线缓存。在你首次访问网站，将部分资源离线缓存，在你网络不好或者无网状态下将会加载这些缓存资源。

## 注册 Service Worker

```html
<!DOCTYPE html>
<html>
  <body></body>
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('sw.js', { scope: '/' })
        .then(function (reg) {
          console.log('Registration succeeded. Scope is ' + reg.scope)
        })
        .catch(function (error) {
          console.log('Registration failed with ' + error)
        })
    }
  </script>
</html>
```

注册成功后在控制台 Application -> Service Workers 将看到：
在你的 service worker 注册之后，浏览器会尝试为你的页面或站点安装并激活它。

## Service Worker 编写

service worker 主要有三个事件： install，activate 和 fetch。

### Install

install： 这个状态发生在 Service Worker 注册之后，表示开始安装，触发 install 事件回调指定一些静态资源进行离线缓存
添加 sw.js ,缓存网站静资源：

```javascript
const cacheVersion = '2018518'
const staticeCacheName = 'static' + cacheVersion //缓存版本（分组）
const cacheList = [
  //缓存列表
  '/',
  'img.png',
]
self.addEventListener('install', function (event) {
  console.log('service worker: install')
  event.waitUntil(
    //确保以下执行后完成 sw 安装。
    caches
      .open(staticeCacheName)
      .then(function (cache) {
        return cache.addAll(cacheList)
      })
      .then(() => self.skipWaiting()) //安装阶段跳过等待，直接进入 active, 保证每次 /sw.js
  )
})
```

- event.waitUntil：执行完内部代码（缓存资源），进行 sw 安装。
- caches.open：添加缓存版本（组）。

刷新页面，你见看到资源已经被缓存。

### activate

当 install 完成后， service worker 进入 active 状态，这个事件立刻执行。如果你的 service worker 已经被安装，但是刷新页面时有一个新版本的可用，新版的 service worker 会在后台安装，但是还没激活。这时候就需要删除旧版本的缓存并注册新的 sw 。

```javascript
self.addEventListener('activate', function (event) {
  console.log('service worker: activate')
  const newCaches = 'newCaches'
  event.waitUntil(
    self.clients.claim(), //更新客户端
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (newCaches.indexOf(key) === -1) {
            return caches.delete(key)
          }
        })
      )
    })
  )
})
```

### fetch

每次任何被 service worker 控制的资源被请求到时，都会触发 fetch 事件，这些资源包括了指定的 scope 内的文档，和这些文档内引用的其他任何资源（比如 index.html 发起了一个跨域的请求来嵌入一个图片，这个也会通过 service worker 。
我们可以利用它来进行监听 http 请求，更改内容。

```javascript
self.addEventListener('fetch', function (event) {
  console.log('service worker: fetch')
  event.respondWith(
    caches
      .match(event.request)
      .then(function (resp) {
        if ((event.request.url = 'xxxxx')) {
          //doSomeThing
        }
        return (
          resp ||
          fetch(event.request).then(function (response) {
            //↑ 如果缓存有直接返回，否则发起网络请求
            return caches.open('fetch').then(function (cache) {
              //↑ 创建新本，缓存新的请求资源
              if (!(event.request.url.indexOf('http') === -1)) {
                //排除 Chrome 扩展
                cache.put(event.request, response.clone()) //将新的新的请求资源推入缓存
                return response
              } else {
                return response
              }
            })
          })
        )
      })
      .catch(function () {
        return caches.match('/error.html') //没有缓存并且请求错误
      })
  )
})
```

## 大公告成

你可以尝试将本站点添加至桌面即可看到效果。
