import * as React from 'react'
import { Component } from 'react'
import { Admin, EditGuesser, ListGuesser, Resource } from 'react-admin'
import { PostCreate } from './components/post/create'
import { PostList } from './components/post/list'
import { PostShow } from './components/post/show'
import { PostEdit } from './components/post/edit'
import graphql from './graphql'
import {
  VideoLibrary,
  AccountBox,
  Description,
  Loyalty,
  Dns,
} from '@material-ui/icons'

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
      <Admin dataProvider={dataProvider}>
        <Resource
          name="Post"
          list={PostList}
          create={PostCreate}
          edit={PostEdit}
          show={PostShow}
          icon={Description}
        />
        <Resource name="User" icon={AccountBox} list={ListGuesser} />
        <Resource name="Video" icon={VideoLibrary} list={ListGuesser} />
        <Resource name="Category" icon={Dns} list={ListGuesser} />
        <Resource name="Tag" icon={Loyalty} list={ListGuesser} />
      </Admin>
    )
  }
}

export default App
