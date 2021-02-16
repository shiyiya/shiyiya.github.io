import React from 'react'
import { Edit, required, SimpleForm, TextInput } from 'react-admin'

export const VideoEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled label="Id" source="id" />
      <TextInput source="title" validate={required()} />
      <TextInput source="episode" />
      <TextInput source="bindPost.id" />
      <TextInput multiline source="subtitle" fullWidth />
      <TextInput source="cover" fullWidth />
      <TextInput source="playUrl" fullWidth />
    </SimpleForm>
  </Edit>
)
