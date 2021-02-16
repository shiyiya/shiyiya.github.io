import React from 'react'
import { List, Datagrid, TextField, DateField } from 'react-admin'

export const VideoList = (props) => (
  <List {...props} exporter={false}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <DateField source="createdAt" />
      <TextField source="bindPost.id" label="post" />
    </Datagrid>
  </List>
)
