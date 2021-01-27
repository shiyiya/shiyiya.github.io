---
title: how-to-set-correctly-font-family
date: 2018-09-27
update: 2019-10-07 18:10:10
tags: web-font-family
photos:
  - https://i.loli.net/2018/10/02/5bb31bba9b66c.gif
---

在不同操作系统、不同游览器里面默认显示的字体是不一样的，为了保持各个平台渲染效果保持一致或者使得显示效果更好，我们就需要设置好 font-family。

根据 font-family 的原则,假如客户终端不认识前面的字体,就自动切换到第二种字体,第二种不认识就切换到第三种,以此类推.假如都不能识别就调用默认字体 。
每个人的审美都不一样，所钟爱的字体可能也有所不同，这里是本站所使用的 font-family：

```css
body {
  font-family:
    /* 1 */ -apple-system, BlinkMacSystemFont, /* 2 */ 'PingFang SC', Arial, 'Microsoft YaHei',
    /* 3 */ Lato, sans-serif;
}
```

<!--more-->

## 注意事项

由于绝大部得分中文字体里都包含英文字母和数字，不进行英文字体声明是没有问题的，但英文字体中大多不包含中文，所以我们需要先进行英文字体的声明，这样不会影响到中文字体的选择。

## 第一组调用系统中默认字体：

- -apple-system 是在以 WebKit 为内核的浏览器（如 Safari）中，调用 Apple（苹果公司）系统（iOS, macOS, watchOS, tvOS）中默认字体（现在一般情况下，英文是 San Francisco，中文是苹方）
- BlinkMacSystemFont 是在 Chrome 中实现调用 Apple 的系统字体

## 第二组已知的系统 UI 字体：

- 'PingFang SC' safari 默认字体
- Arial window 默认字体
- 'Microsoft YaHei'

## 第三组回退处理

当默认字仔无法获取（低版本平台），其他字体没有时，则使用默认的无衬线字体

## 使用外部字体

```css
/* 声明字体 */
@font-face {
  font-family: 'Telefon Black';
  src: url(../font/TelefonBlack.woff) format('woff'), url(../font/TelefonBlack.woff2)
      format('woff2');
}
/* 根据 font-weight 去选择不同的变体 */
@font-face {
  font-family: 'Telefon Black';
  font-weight: 300;
  src: local('TelefonBlack Light') format('woff'), local('TelefonBlack Light') format(
        'woff2'
      );
}
/* 使用字体 */
.site-title {
  -webkit-font-smoothing: antialiased;
  font-family: 'Telefon Black', Sans-Serif;
  font-size: 48px;
  font-weight: 600;
  color: #000;
}
```
