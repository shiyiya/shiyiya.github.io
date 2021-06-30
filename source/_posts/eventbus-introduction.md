---
title: EventBus 应用及简易实现
date: 2021-6-30 11:00:58
update: 2021-6-30 11:00:58
tags: [eventbus]
urlname: eventbus-introduction
---

eventbus：使用发布订阅模式，多用于跨组件跨页面通信，即将一些个互不相干的远房亲戚建立通信。并不需要改动过多的代码，只需在需要的时候注册监听即可，大大降低代码耦合。

## eventbus 的应用场景

此时有这么一个需求，实现一个类似微信小程序的 toast ，使其在任意页面可直接调用显示，此时就可以用 eventbus 将 toast 与任意页面建立联系。

```js
// 主入口

<>
  <Toast />
  <Routes />
</>
```

```js
// toast
const Toast = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const addToast = ({ type = 'success', title, message, duration = 5 }) => {
      const id = uuid()

      setToasts((currentToasts) => [
        { id, type, title, message },
        ...currentToasts
      ])

      if (duration) {
        setTimeout(() => removeToast(id), duration * 1000)
      }
    }

    const removeToast = (id) => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      )
    }

    // 添加订阅
    eb.on('toast', addToast)

    return () => eb.off('toast', addToast)
  }, [])

  return (
    <div>
      <TransitionGroup>
        {toasts.map((toast) => (
          <CSSTransition key={toast.id} classNames="toast" timeout={200}>
            <div
              key={toast.id}
              type={toast.type}
              onClick={() => removeToast(toast.id)}
            >
              {toast.title && <Title>{toast.title}</Title>}
              {toast.message && <Message>{toast.message}</Message>}
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  )
}
```

```js
// 任意位置
pubsub.emit('toast', { title: 'Hello', message: 'Hello' })
```

## 简易 eventbus 实现

```ts
class EventBus {
  private events: Record<string, Array<any>> = Object.create(null)

  on<T>(name: string, fn: (data: T) => void) {
    this.events[name] || (this.events[name] = [])
    this.events[name].push(fn)
  }

  emit(name: string, data?: any) {
    this.events[name]?.forEach((fn: Function) => {
      fn(data)
    })
  }

  once<T>(name: string, fn: (data: T) => void) {
    this.events[name] || (this.events[name] = [])
    const f = (...arg: any) => {
      fn(arg)
      this.off(name, f)
    }
    this.events[name].push(f)
  }

  off(name: string, fn?: Function) {
    if (fn) {
      this.events[name].splice(
        this.events[name].findIndex((_) => _ === fn),
        1
      )
    } else {
      delete this.events[name]
    }
  }
}
```

## 基于 DOM 的实现

```ts
class DomEventBus {
  private eventTarget: EventTarget

  constructor(comment: string) {
    this.eventTarget = document.createComment(comment)
  }

  on<T>(name: string, listener: (event: CustomEvent<T>) => void) {
    this.eventTarget.addEventListener(name, listener as any)
  }

  once<T>(name: string, listener: (event: CustomEvent<T>) => void) {
    this.eventTarget.addEventListener(name, listener as any, { once: true })
  }

  emit<T>(name: string, data?: T) {
    this.eventTarget.dispatchEvent(new CustomEvent(name, { detail: data }))
  }

  off(name: string, listener: (event: CustomEvent<any>) => void) {
    this.eventTarget.removeEventListener(name, listener as any)
  }
}
```
