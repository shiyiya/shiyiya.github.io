import * as React from 'react'
import { Component } from 'react'
import { Admin, Resource } from 'react-admin'
import { PostCreate } from './components/post/create'
import { PostList } from './components/post/list'
import { PostShow } from './components/post/show'
import { PostEdit } from './components/post/edit'
import graphql from './provider/graphql'
import { VideoLibrary, AccountBox, Description } from '@material-ui/icons'
import authProvider from './provider/auth'
import Dashboard from './components/Dashboard'
import { createBrowserHistory as createHistory } from 'history'
import { VideoEdit } from './components/video/edit'
import { VideoShow } from './components/video/show'
import { VideoList } from './components/video/list'
import { UserList } from './components/user/list'
import { UserShow } from './components/user/show'
import { UserEdit } from './components/user/edit'
import { VideoCreate } from './components/video/create'

const history = createHistory()

class App extends Component {
  constructor() {
    super()
    this.state = { dataProvider: null }
  }

  componentDidMount() {
    graphql().then((_) => {
      this.setState(() => ({ dataProvider: _ }))
    })
  }

  render() {
    const { dataProvider } = this.state

    if (!dataProvider) {
      return <div>Loading</div>
    }

    return (
      <Admin
        dataProvider={dataProvider}
        // authProvider={authProvider}
        dashboard={Dashboard}
        history={history}
      >
        <Resource
          name="Post"
          list={PostList}
          create={PostCreate}
          edit={PostEdit}
          show={PostShow}
          icon={Description}
        />
        <Resource
          name="Video"
          icon={VideoLibrary}
          list={VideoList}
          edit={VideoEdit}
          show={VideoShow}
          create={VideoCreate}
        />
        <Resource
          name="User"
          icon={AccountBox}
          list={UserList}
          show={UserShow}
          edit={UserEdit}
        />
        {/* <Resource name="Category" icon={Dns} list={ListGuesser} />
        <Resource name="Tag" icon={Loyalty} list={ListGuesser} /> */}
      </Admin>
    )
  }
}

export default App
