import React from 'react'
import { List, Datagrid, TextField, EmailField } from 'react-admin'

export const UserList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <EmailField source="email" />
      <TextField source="username" />
    </Datagrid>
  </List>
)
