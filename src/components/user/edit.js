import React from 'react'
import { Edit, SimpleForm, TextInput } from 'react-admin'

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled label="Id" source="id" />
      <TextInput source="createdAt" disabled />
      <TextInput source="email" />
      <TextInput source="username" />
      <TextInput source="bio" />
      <TextInput source="avatar" fullWidth />
    </SimpleForm>
  </Edit>
)
