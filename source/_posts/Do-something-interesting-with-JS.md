---
title: Do something interesting with JS
date: 2018-06-30 10:51:10
update: 2019-10-11 10:51:10
tags: [JS]
urlname: do-something-interesting-with-JS
---

## 离开和进入页面时改变 title

利用 Page Visibility，该规范定义了一种用于站点开发人员以编程方式确定页面的当前可见性状态以便开发功率和 CPU 高效的 Web 应用程序的手段。

<!--more-->

### Document 接口

Document.hidden
如果默认视图中的 文件为空，在获取时，该 hidden 属性必须返回 true。
document.visibilityState:
visibilityState 属性
返回当前视图状态，分别为：
-- hidden
-- visible
-- prerender
-- unloaded

visibilitychange 事件

当用户代理确定顶级浏览上下文包含 的文档的可见性 已更改时， 用户代理必须触发文档上的 visibilitychange 事件 。

```js
var DefaultTitle = document.title
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    document.title = '你要去哪裏呢~~~'
  } else {
    document.title = 'QwQ~~'
    setTimeout(function () {
      document.title = DefaultTitle
    }, 2000)
  }
})
```

## Copy Or Paste 恶搞

利用 Window.getSelection clipboardData.setData

原理：监听 copy 事件，获取 Copy 内容，操作剪切板并修改剪切板内容。

```js
document.addEventListener('copy', function (e) {
  var word = window.getSelection
    ? window.getSelection().toString()
    : document.selection.createRange().text
  if (word.length > 1) {
    DiyWord(e)
    console.log('商业转载请联系作者获得授权，非商业转载请注明出处，谢谢合作。')
  }
})
function DiyWord(e) {
  var clipboardData = e.clipboardData || window.clipboardData
  if (clipboardData) {
    event.preventDefault()
    //window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    var Hello =
      '商业转载请联系作者获得授权，非商业转载请注明出处，谢谢合作。 ->此为粘贴'
    //clipboardData.setData('text/html', Hello);
    clipboardData.setData('text/plain', Hello)
  }
}
//更多有趣的使用姿势自行探索 Ψ(￣ ∀ ￣)Ψ
```

## 自定义 log 输出

```js
var _log = console.log
console.log = function () {
  _log.call(
    console,
    '%c' + [].slice.call(arguments).join(' '),
    'color:transparent;text-shadow:0 0 14px rgba(0,0,0,.8);'
  )
}
console.log(
  '                                       .. .vr       \n                                     qBMBBBMBMY     \n                                    8BBBBBOBMBMv    \n                                  iMBMM5vOY:BMBBv    \n                  .r,             OBM;   .: rBBBBBY   \n                  vUL             7BB   .;7. LBMMBBM.  \n                 .@Wwz.           :uvir .i:.iLMOMOBM..  \n                  vv::r;             iY. ...rv,@arqiao. \n                   Li. i:             v:.::::7vOBBMBL.. \n                   ,i7: vSUi,         :M7.:.,:u08OP. .  \n                     .N2k5u1ju7,..     BMGiiL7   ,i,i.  \n                      :rLjFYjvjLY7r::.  ;v  vr... rE8q;.:,, \n                     751jSLXPFu5uU@guohezou.,1vjY2E8@Yizero. \n                     BB:FMu rkM8Eq0PFjF15FZ0Xu15F25uuLuu25Gi.   \n                   ivSvvXL    :v58ZOGZXF2UUkFSFkU1u125uUJUUZ,   \n                 :@kevensun.      ,iY20GOXSUXkSuS2F5XXkUX5SEv.  \n             .:i0BMBMBBOOBMUi;,        ,;8PkFP5NkPXkFqPEqqkZu.  \n           .rqMqBBMOMMBMBBBM .           @kexianli.S11kFSU5q5   \n         .7BBOi1L1MM8BBBOMBB..,          8kqS52XkkU1Uqkk1kUEJ   \n         .;MBZ;iiMBMBMMOBBBu ,           1OkS1F1X5kPP112F51kU   \n           .rPY  OMBMBBBMBB2 ,.          rME5SSSFk1XPqFNkSUPZ,.\n                  ;;JuBML::r:.:.,,        SZPX0SXSP5kXGNP15UBr.\n                      L,    :@huhao.      :MNZqNXqSqXk2E0PSXPE .\n                  viLBX.,,v8Bj. i:r7:,     2Zkqq0XXSNN0NOXXSXOU \n                :r2. rMBGBMGi .7Y, 1i::i   vO0PMNNSXXEqP@Secbone.\n                .i1r. .jkY,    vE. iY....  20Fq0q5X5F1S2F22uuv1M; \n        '
)
```

todo more
