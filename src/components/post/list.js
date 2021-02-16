import React from 'react'
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  Filter,
  TextInput,
} from 'react-admin'

const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="name" alwaysOn />
  </Filter>
)

export const PostList = (props) => (
  <List
    {...props}
    exporter={false}
    // filters={<PostFilter />}
  >
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
