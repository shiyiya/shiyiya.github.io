---
title: JS 中的深 & 浅拷贝
date: 2018-06-30
update: 2019-10-07 18:27:44
tags: [JS]
photos:
  - https://i.loli.net/2018/09/20/5ba274c04b99f.jpg
urlname: js-shallow-copy-and-deep-copy
---

## 浅复制和深复制的区别？

- 浅复制（shallow copy）：只复制指向某个对象的指针，而不复制对象本身，新旧对象 u 共享一块内存；
- 深复制（deep copy）：复制并创建一个一摸一样的对象，不共享内存，修改新对象，旧对象保持不变。

即最大的区别在于，复制过程中的值是否为引用传值。

<!--more-->

### 什么情况下是引用传递呢？

众所周知，JS 中现在有七个不同类型：

- 六种 原型(基本) 数据类型: Boolean null undefined Number String Symbol
- Object 对象：又包括特殊 Object 类型

其中基本类型为传值，引用类型（Object）则为引用传递。

## 浅复制 VS 深复制

什么是浅复制和深复制。

```javascript
var target = 1 //原始类型
var result = target1 //深->值传递
target = 2
console.log(target, result) // 1 2

//浅复制
var target = { a: 1 } //Object
var result = target //浅->引用传递
target.a = 2
console.log(target, result) //{a: 2} {a: 2}

//深复制(基本实现)
var target = { a: 1 }
var result = { a: target.a } //转化为基本类型 1
target.a = 2
console.log(target, result) //{a: 2} {a: 1}
```

## Object 浅拷贝

```javascript
var target = { a: 1, b: { c: 'c' } }

var result = Object.assign({}, target)
target.a = 2
console.log(target, result)
//{a: 2, b: {c:"c"}} {a: 1, b: {c:"c"}}

//由于 `Object,assign(..)` 是使用 = 进行的赋值操作
//当源对象的属性值是指向对象的引用时，也只拷贝引用值。
target.b.c = 2
console.log(result) //{a: 1, b: {c:"c"}}
```

## 深拷贝

```javascript
//JSON 安全
JSON.parse(JSON.stringify(target))

// 递归遍历
function deepCopy(target) {
  const _toString = Object.prototype.toString

  if (!target || typeof target !== 'object') {
    //null,undefined,!object
    return target
  }

  if (_toString.call(target) === '[object Date]') {
    return new Date(target.getTime())
  }

  if (_toString.call(target) === '[object RegExp]') {
    let rules = []
    target.global && rules.push('g')
    target.multiline && rules.push('m')
    target.ignoreCase && rules.push('i')
    return new RegExp(target.source, flags.join(''))
  }

  let result = Array.isArray(target) ? [] : {}

  for (let key in target) {
    result[key] = deepCopy(target[key])
  }
  return result
}
```
