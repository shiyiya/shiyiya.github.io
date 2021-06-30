---
title: 理解 React-Redux
date: 2018-05-22
update: 2019-10-07 18:16:14
tags: [react-redux]
urlname: Implementation-of-simple-react-Redux
---

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。
React-Redux 用于连接 React、Redux。

<!-- more -->

## action

action => 是纯声明式的数据结构，只提供事件的所有要素，不提供逻辑,返回一个对象。
Action 的任务是描述它想做什么？

```js
const changeTitle = () => ({
  type: 'CHANGE_TITLE', //告诉我们它想改变title，并返回改变的东西。
  newTitle: 'Hello Reducer',
})
```

## reducer

reducer => 匹配 action,返回新的 state。
reducer 就是帮我们做 action 想做的事~如何去做,todo。
(state, action) => newState

```js
const initialState = {
  title: 'Hello world',
}
const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_TITLE':
      return {
        title: action.newTitle, //返回一个title覆盖原title，以改变title
      }
    default:
      return state
  }
}
```

## store

Store => 就是我们存取状态数据的地方，外加可以订阅状态数据改变时触发的事件。
所有的 state 都以一个对象树的形式储存在一个单一的 store 中。

维持应用的 state；
提供 getState() 方法获取 state；
提供 dispatch(action) 方法更新 state；
通过 subscribe(listener) 注册监听器；
const store = createStore(Reducer);
console.log(store.getState());//输出{title: "Hello world"}
store.dispath(changeTitle());
console.log(store.getState());//输出{title: "Hello reducer"}

## use with react

Redux 和 React 之间没有关系。Redux 可以搭配 React、Angular 甚至纯 JS。但是 Redux 还是比较适合和 React 搭配的，因为 React 允许你以 state 的形式来描述界面，而 Redux 非常擅长控制 state 的变化。

create-react-app demo
rm -rf src/\*
yarn add react-redux redux
新建 src/index.js & src/app.js;

```js
import React from 'react'
import ReactDOM from 'react-dom'

const Hello = () => <h1>'Hello world!!!'</h1>

ReactDOM.render(<Heloo />, document.getElementById('root'))
```

yarn start 现在刷新浏览器你能看到 Hello world。

## create store & reducer

所有容器组件都可以访问 Redux store，所以可以手动监听它。一种方式是把它以 props 的形式传入到所有容器组件中。但这太麻烦了，因为必须要用 store 把展示组件包裹一层，仅仅是因为恰好在组件树中渲染了一个容器组件。

建议的方式是使用指定的 React Redux 组件 <Provider> 来 魔法般的 让所有容器组件都可以访问 store，而不必显示地传递它。只需要在渲染根组件时使用即可。

```js
//src/reducers/index.js
const initialState = {
  title: 'Hello world',
}

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_TITLE':
      return {
        title: 'Hello reducer',
      }
    default:
      return state
  }
}
export default Reducer
// src/components/index.js
import React from 'react'

const App = () => (
  <div>
    <h1>hello world!</h1>
    <button>Change</button>
  </div>
)
export default App
//src/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import App from './components/'
import Reducer from './reducers/'

const store = createStore(Reducer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
console.log(store.getState()) //{title: "Hello world"}
```

## connect

连接组件与 store

```js
import React from 'react'
import { connect } from 'react-redux'

const App = (props) => (
  <div>
    {console.log(props)}
    <h1>hello world</h1>
    <button>Change</button>
  </div>
)
export default connect()(App)
```

如果你打开你的开发者工具控制台，你应该看到一条消息！

组件现在可以通过 store 的 dispath 函数改变'state'。

```js
// src/components/index.js
import React from 'react'
import { connect } from 'react-redux'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.props.dispatch({ type: 'CHANGE_TITLE', title: 'hello redux' })
  }
  render() {
    return (
      <div>
        <h1>hello world</h1>
        <button>Change</button>
      </div>
    )
  }
}
export default connect()(App)
```

现在 title 改变了！

## To change

利用 connect 将 state 注入到组件(props)
点击按钮，hello world 将变成 hello reducer

```js
// src/component/index.js
import React from 'react'
import { connect } from 'react-redux'

class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { title, dispatch } = this.props
    return (
      <div>
        <h1>{this.props.title}</h1>
        <button
          onClick={() =>
            dispatch({ type: 'CHANGE_TITLE', title: 'hello redux' })
          }
        >
          Change
        </button>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    title: state.title,
  }
}
export default connect(mapStateToProps)(App)
```

## create action

将 action 抽离，并注入到组件(props)中.

```js
// src/actions/index.js
export const changeTitle = () => ({
  type: 'CHANGE_TITLE',
  newTitl: 'Hello Stark',
})
export const resetTitle = () => ({
  type: 'RESET_TITLE',
  newTitle: 'reset',
})

// src/components/index.js
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as action from '../actions/'

class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { title, changeTitle, resetTitle } = this.props
    console.log(this.props)
    return (
      <div>
        <h1>{title}</h1>
        <button onClick={changeTitle}>Change</button>
        <button onClick={resetTitle}>Reset</button>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    title: state.title,
  }
}
function mapActionCreatorsToProps(dispatch) {
  return bindActionCreators(action, dispatch) //合并多个action
}
export default connect(mapStateToProps, mapActionCreatorsToProps)(App)
// src/reducers/index.js
const initialState = {
  title: 'Hello world',
}

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_TITLE':
      return {
        title: action.newTitle,
      }
    case 'RESET_TITLE':
      return {
        title: action.newTitle,
      }
    default:
      return state
  }
}
export default Reducer
```
