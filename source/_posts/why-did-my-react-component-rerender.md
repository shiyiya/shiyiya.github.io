---
title: 为什么我的 React 组件重新渲染(re-render)了
date: 2023-06-09
update: 2023-06-09
tags: [react]
urlname: why-did-my-react-component-rerender.md
---

## 为什么我的 React 组件重新渲染(re-render)了

## render or re-render

渲染分为首次渲染(render)和更新(re-render); 首次渲染是不可避免的, 当组件的 props,state 或者 context 等依赖发生改变时则会触发当前组件和子组件的重新渲染, 当更新过于频繁、嵌套过深就可能产生卡顿或性能问题. 下面这个例子中 Child 会随着 state, context, props 等的变更而重新渲染.

```jsx
const Context = createContext()

const Provider = ({ children }) => {
  const [count, setCount] = useState(0)

  return (
    <Context.Provider value={count}>
      <button onClick={() => setCount((c) => (c += 1))}>p +</button> - {children}
    </Context.Provider>
  )
}

const Parent = () => {
  const [count, setCount] = useState(0)

  return (
    <Provider>
      <button onClick={() => setCount((c) => (c += 1))}>s +</button>
      <br />
      <Child count={count} />
    </Provider>
  )
}

const Child = ({ count }) => {
  const pcount = useContext(Context)

  console.log('render', count, pcount)
  return (
    <span>
      {pcount}-{count}
    </span>
  )
}
```

## props 变更就重新渲染么? 避免非必要更新

根据之前说的, 当 props 变化后子组件触发 re-render, 真的是这样么?
下面例子中当我点击增加 count 时, 尽管 2 没有依赖 count、3 甚至没有接受 props,但是他们都触发了 re-render, 这是因为渲染是自上而下的, 当组件的父级重新渲染时, 组件自身也会重新渲染, 很明显 2 和 3 的更新是不必要的,如果组件较`重`,就可能出问题了.

```jsx
const Parent = () => {
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(0)

  return (
    <>
      <button onClick={() => setCount((c) => (c += 1))}>+</button>
      {' - '}
      <button onClick={() => setCount2((c) => (c += 1))}>+</button>
      <br />
      <Child count={count} />
      <Child2 count={count2} />
      <Child3 />
    </>
  )
}

const Child = ({ count }) => {
  console.log('render', count)

  return <span>{count}</span>
}

const Child2 = ({ count }) => {
  console.log('render Child2')

  return <span>{count}</span>
}

const Child3 = () => {
  console.log('render Child3')

  return <span>hi</span>
}
```

解决: 使用 memo 避免非必要更. memo 会对 props 进行前浅比较(Object.is), 当新旧 props 一致时跳过本次 re-render.

```jsx
//使用 memo 后只有 count 变更才触发组件的 re-render
const Child = React.memo(({ count }) => {
  console.log('render', count)
  return <span>{count}</span>
})
```

## 声明的 props 真的没变么? 避免引用类型的 props 传递

我们把每个组件看作一个函数, 当组件每次 render 时实际上等于重新执行了这个函数, 所以内部声明将会重建, 引用类型的新值将不会等于旧值.

```jsx
// 它们都是 false
console.log(Object.is({}, {}))
console.log(
  Object.is(
    () => {},
    () => {}
  )
)
// etc...
```

此时如果将其作为 props 传递给子组件, 将会导致子组件认为 props 被更新, 而引起非必要更新,下面例子中,只要父组件更新, count,renderChild 都将会重建, 从而引发子组件的 re-render.

```jsx
// 常见写法
const Parent = () => {
  const [, forceUpdate] = useState({})
  const count = { value: 0 } // 引用发生改变
  const handle = () => {} // 每次都是新函数
  const Header = () => <h1>hi</h1> // 每次都是全新的组件

  return (
    <>
      <button onClick={() => forceUpdate({})}>+</button>
      <br />
      <Child count={count} header={Header} handle={handle} />
    </>
  )
}

const Child = memo(({ count, header: Header, handle }) => {
  console.log('render', count.value)
  return (
    <>
      <Header />
      <span>{count.value}</span>
    </>
  )
})
```

解决:

- 使用 useMemo, useCallback, useRef 缓存相关的值. 它们都可以保证相同的引用

```jsx
const ObjectProps = () => {
  const [, forceUpdate] = useState({})
  const count = useRef({ value: 0 })
  const handle = useCallback(() => {}, [])
  const Header = useMemo(() => () => <h1>hi</h1>, [])

  return (
    <>
      <button onClick={() => forceUpdate({})}>+</button>
      <br />
      <Child count={count} header={Header} handle={handle} />
    </>
  )
}

const Child = memo(({ count, header: Header, handle }) => {
  console.log('render', count?.value)
  console.log(Header)
  return (
    <>
      <Header />
      {count.current?.value}
    </>
  )
})
```

## memo 不是银弹

使用 memo,useCallback,useMemo, 也是有有成本的, 应该合理的组建、拆分我们的 React 组件,奖状态者向下传递转移.

- bad

```jsx
const Parent = () => {
  const [show, toggle] = useState(false)

  return (
    <>
      <button onClick={() => toggle((v) => !v)}>toggle</button>
      {show && <CompA />}
      <CompB />
      <CompC />
    </>
  )
}
```

- good

```jsx
// 向下传递状态
const Toggle = () => {
  const [show, toggle] = useState(false)

  return (
    <>
      <button onClick={() => toggle((v) => !v)}>toggle</button>
      {show && <CompA />}
    </>
  )
}
const Parent = () => {
  return (
    <>
      <CompB />
      <CompC />
    </>
  )
}

// 向下传递状态
const Toggle = forwardRef((_, ref) => {
  const [show, toggle] = useState(false)

  useImperativeHandle(ref, toggle, [])

  return <>{show && <CompA />}</>
})

const Parent = () => {
  const ref = useRef()

  return (
    <>
      <button onClick={() => ref.current?.((v) => !v)}>toggle</button>
      <Toggle ref={ref}/>
      <CompB />
      <CompC />
    </>
  )
}

//组件作为 props
const Wrap = ({ A, B }) => {
  const [show, toggle] = useState(false)

  return (
    <>
      <button onClick={() => toggle((v) => !v)}>toggle</button>
      {A}
      {B}
    </>
  )
}

const Parent = () => {
  return (
    <>
      <Wrap b={<CompB />} C={<CompC />} />
    </>
  )
}

// 使用状态管理
import { atom, useAtomValue, useSetAtom } from 'jotai'

const showAtom = atom(false)

const Toggle = () => {
  const show = useAtomValue(showAtom)
  return <>{show && <CompA />}</>
}

const Parent = () => {
  const toggle = useSetAtom(showAtom)

  return (
    <>
      <button onClick={() => toggle((v) => !v)}>toggle</button>
      <CompB />
      <CompC />
    </>
  )
}
```
