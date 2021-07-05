---
title: Vue3中的依赖收集 (reactive)
date: 2021-7-5
tags: [reactive, vue3]
urlname: reactive-in-vue3
---

vue3 中的依赖收集

依赖收集：通过自然地使用变量，来完成依赖的收集，当变量改变时，根据收集的依赖判断是否需要触发回调。

举个例子 
```js
const state= reactive({ count:1 })
effect(()=>{
 // update ... 
   document.title=`${state.count}`
})
```

上面例子中， effect 收集内部依赖(内部使用到的变量) state.count，当依赖改变时根据收集好的依赖关系判断是否有对应回调(更新)

## 依赖收集的实现

我们需要在每次 getter 的时候将对应的依赖关系确定，此后执行 setter 时就能知道那个依赖更新了，并执行对应的回调；所以我们可以使用 proxy 重写 setter & getter，将收集和更新代码置入其中。

```js
const targetsMap = new WeakMap() 
// { target { key ［...effect］} }

function track(target, key) {
  let depsMap = targetsMap.get(target)
  if (!depsMap) {
    targetsMap.set(target, (depsMap = new Map()))
  }
  
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  
  deps.add(effect) // 添加动作
}

function trigger(target, key) {
  const depsMap = targetsMap.get(target) 
  if (!depsMap) {
    return
  }
  let deps = depsMap.get(key)
  if (deps) {
    deps.forEach(effect => {
      effect()
    })
  }

function reactive(target) {
  const handlers = {
    get(target, key, receiver) {
      track(target, key) // 收集依赖
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      let oldValue = target[key]
      const newValue = Reflect.set(target, key, value, receiver)
      if (result && oldValue != value) {
        trigger(target, key) // 依赖更新
      }
      return newValue
    },
  }
  return new Proxy(target, handlers)
}
 
// 暂时不实现
// function effcect(){}


const state= reactive({ count:1 })

// 写死
function effect(){
   // update ... 
   document.title=`${state.count}`
}

// 当更新 state 的值时就会触发回调(effect)
state.count = 2
```

当state改变时 effect 将会更新 title，但此时effect是写死的，我想添加其他更新总不能一个个去加吧，此时重头戏才刚刚开始！

上面说了，在 getter 时，去依赖收集，如何触发更新内的 getter ？

## 实现之前的 effect
 
```js
currentEffect=null

function effect(effect){
 currentEffect=effect //保存effect，以便getter时建立依赖 ，此时 track 只需将currentEffect加入deps即可
  effect() // 触发 effect 内 getter 进行依赖收集 
  currentEffect// 收集完成
}
```

是的，只需要执行它，就像开始的例子一样，此时业务代码 effect 写法

```js
effect(()=>{
 // update ... 
   document.title=`${state.count}`
})

// more ...
effect(()=>{
 // update ... 
   document.body.innerHTML = `${state.count}`
})
```

## useref

## usecomputed


## 相关链接
- https://github.com/vuejs/vue-next/tree/master/packages/reactivity
 
 
