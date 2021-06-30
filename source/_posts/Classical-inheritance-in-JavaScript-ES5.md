---
title: Classical inheritance in JavaScript ES5
date: 2018-12-25
update: 2019-10-06 11:00:58
tags: [es5-extends]
urlname: classical-inheritance-in-JavaScript-ES5
---

在 JavaScript 中，最让人困扰的几根莫过于 this、闭包、作用域、原型链，而却常常看又常常忘，最近又看了一下高程感觉清晰了很多，于是就想写在这里（水一篇文章）。

<!--more-->

## 面向对象的 JS

- 面向对象

- 原型编程
  MDN 上的[解释](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#%E5%8E%9F%E5%9E%8B%E7%BC%96%E7%A8%8B)

> 原型编程
> 基于原型的编程不是面向对象编程中体现的风格，且行为重用（在基于类的语言中也称为继承）是通过装饰它作为原型的现有对象的过程实现的。这种模式也被称为弱类化，原型化，或基于实例的编程。

大概为了实现面向对象引入了原型链等。

## 继承

在此之前，先看一下 mdn 上 new 的解释：

当代码 new Foo(...) 执行时，会发生以下事情：
**一个继承自 Foo.prototype 的新对象被创建**。
使用指定的参数调用构造函数 Foo ，并将 this 绑定到新创建的对象。new Foo 等同于 new Foo()，也就是没有指定参数列表，Foo 不带任何参数调用的情况。
由构造函数返回的对象就是 new 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤 1 创建的对象。（一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤

## 继承的几种方法

### 原型链继承

```javascript
function Parent() {
  this.name = 'Parent'
  this.children = []
}

Parent.prototype.getAttr = function () {
  console.log(this.name, this.children)
}

function Child() {}
Child.prototype = new Parent()

var instance = new Child()

instance.constructor == Parent //true
instance.getAttr() //Parent []

//此时所有引用实例共享属性(弊端)
var instance2 = new Child()
instance.name = 'instance'
instance.children.push('instance')

child2.getAttr() //Parent ["instance"]
```

### 借用构造函数

此方法是使用 call 或者 apply 方法，将父类的构造函数 this 绑定到子类上，当实例化子类式调用父类构造函数并绑定 this。所以每个实例都有自己的一份拷贝。

```javascript
function Parent() {
  this.name = 'Parent'
  this.children = []

  // 此时方法也需在父类构造函数中声明，每次都会生成一个全新的 func
  this.getAttr = function () {}
}

function Child() {
  Parent.call(this)
}

var instance = new Child()
var instance2 = new Child()

instance.children.push('instance1')
instance2.children.push('instance2')

//["instance1"] ["instance2"]
console.log(instance.children, instance2.children)
```

### 组合继承

```javascript
function Parent() {
  this.name = 'Parent'
  this.children = []

  // 此时方法也需在父类构造函数中声明
  this.getAttr = function () {}
}

function Child() {
  Parent.call(this)
}

// 直接继承公共方方法
Child.prototype = new Parent()

// 修成原型链
Child.prototype.constructor = Child

// 此时继承自 Child.prototype 的新对象被创建
var instance = new Child()
var instance2 = new Child()

instance.children.push('instance1')
instance2.children.push('instance2')

//["instance1"] ["instance2"]
console.log(instance.children, instance2.children)
```

### 寄生继承

```javascript
function Parent() {
  this.name = 'Parent'
  this.children = []
}

var instance = Object.create(Parent)
寄生 + 组合
function Parent() {
  this.name = 'Parent'
  this.children = []
}

function Child() {
  Parent.call(this)
}

var prototype = Object.create(Parent)

//继承原型
prototype.constructor = Child
Child.prototype = prototype
```

### ES6 中的继承

class Child extend Parent{}

### ES6 多继承

- mixins

```javascript
function mixins(derivedCtor, baseCtors) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtor.prototype[name]
    })
  })
}
mixins(child, [parent, ...other])
```
