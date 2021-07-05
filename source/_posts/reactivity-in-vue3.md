---
title: Vue3 中的依赖收集 (reactive)
date: 2021-7-5
update: 2021-7-5
tags: [reactivity, vue3]
urlname: reactivity-in-vue3
---

依赖收集：通过自然地使用变量，来完成依赖的收集，当变量改变时，根据收集的依赖判断是否需要触发回调。

举个栗子：

```js
const state = reactive({ count: 1 })
effect(() => {
  // update ...
  document.title = `${state.count}`
})
```

上面例子中，`effect` 收集内部依赖(内部使用到的变量) `state.count`，当依赖改变时根据收集好的依赖关系判断是否有对应回调(更新)

## 依赖收集的实现

我们需要在每次 `getter` 的时候将对应的依赖关系确定，此后执行 `setter` 时就能知道那个依赖更新了，并执行对应的回调；所以我们可以使用 `proxy` 重写 `setter` & `getter`，将收集和更新代码置入其中。

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

  if (!depsMap) return

  let deps = depsMap.get(key)
  if (deps) {
    deps.forEach((dp) => {
      dp()
    })
  }
}

function reactive(target) {
  const handlers = {
    get(target, key, receiver) {
      track(target, key) // 收集依赖
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      if (Reflect.set(target, key, value, receiver) && oldValue != value) {
        trigger(target, key) // 依赖更新
      }
      return value
    }
  }
  return new Proxy(target, handlers)
}

////////////////////////////////

const state = reactive({ count: 1 })

// 写死
function effect() {
  // update ...
  document.title = `${state.count}`
}

//手动触发 getter
effect()
// 当更新 state 的值时就会触发回调(effect)
state.count = 2
```

当 state 改变时 effect 将会更新 title，但此时 effect 是写死的，我想添加其他更新总不能一个个去加吧，此时重头戏才刚刚开始！

上面说了，在 getter 时，去依赖收集，如何自动触发更新内的 getter ？

## 实现之前的 effect

```js
currentEffect = null

function effect(effect) {
  // 保存effect，以便 getter时建立依赖
  // 此时 track 只需将 currentEffect 加入deps即可
  currentEffect = effect
  // 触发 effect 内 getter 进行依赖收集
  effect()
  currentEffect = null // 收集完成
}
```

是的，只需要给他包装一层就行了，就像开始的例子一样，此时业务代码 effect 写法

```js
effect(() => {
  // update ...
  document.title = `${state.count}`
})

// more ...
effect(() => {
  // update ...
  document.body.innerHTML = `${state.count}`
})
```

此时的代码：[点我](/code/reactive-effect.js)

## ref

因为基础类型无法进行监听，所以它使用 `xx.value`，扩展一下就行。

```js
function ref(v) {
  const def = {
    get value() {
      track(def, 'value')
      return v
    },
    set value(newVal) {
      v = newVal
      trigger(def, 'value')
    }
  }

  return def
}
```

## computed

同样，effect 是执行一个函数，computed 返回数据, 只需要包装一下 effect ，保持返回结构就可以了！

```js
function computed(computed) {
  const result = ref() // 保存返回值
  effect(() => {
    result.value = computed
  })
  return result
}
```

## 相关链接

- [最终代码](/code/reactivity.js)
- [@vue/reactivity](https://github.com/vuejs/vue-next/tree/master/packages/reactivity)
