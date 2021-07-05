const targetsMap = new WeakMap() // { target { key ［...effect］} }
let currentEffect = null

function track(target, key) {
  if (!currentEffect) return
  let depsMap = targetsMap.get(target)
  if (!depsMap) {
    targetsMap.set(target, (depsMap = new Map()))
  }

  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }

  deps.add(currentEffect) // 添加动作
}

function trigger(target, key) {
  const depsMap = targetsMap.get(target)

  if (!depsMap) return

  const deps = depsMap.get(key)
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

function effect(eff) {
  currentEffect = eff
  eff()
  currentEffect = null
}

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

function computed(getter) {
  const result = ref() //
  effect(() => {
    result.value = getter()
  })
  return result
}

////////////////////////////////

const state = reactive({ count: 0 })
const count = ref(0)

effect(() => {
  document.title = `${state.count}-${count.value}`
})

const total = computed(() => count.value + state.count)

state.count = 2 // update the title
count.value = 2 // update the title
console.log(total.value) //4
