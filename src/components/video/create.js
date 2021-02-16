import React from 'react'
import {
  Create,
  NumberInput,
  required,
  SimpleForm,
  TextInput,
} from 'react-admin'

export const VideoCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" validate={required()} />
      <NumberInput source="episode" />
      <TextInput source="bindPost.id" name="bindPostId" />
      <TextInput multiline source="subtitle" fullWidth />
      <TextInput source="cover" fullWidth />
      <TextInput source="playUrl" fullWidth />
    </SimpleForm>
  </Create>
)
