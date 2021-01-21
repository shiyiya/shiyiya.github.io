import React from 'react'
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
} from 'react-admin'

export const PostList = (props) => (
  <List {...props} exporter={false}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <NumberField source="type" />
      <DateField source="createdAt" />
      <ReferenceField label="Creator" source="creator.id" reference="User">
        <TextField source="username" />
      </ReferenceField>
    </Datagrid>
  </List>
)
