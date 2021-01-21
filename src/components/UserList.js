import * as React from 'react'
import { List, Datagrid, TextField, EmailField } from 'react-admin'
import LinkField from './LinkField'

export const UserList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <EmailField source="email" />
      <LinkField source="website" />
    </Datagrid>
  </List>
)
