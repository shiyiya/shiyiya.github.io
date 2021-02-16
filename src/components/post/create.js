import React from 'react'
import { Create, SimpleForm, TextInput } from 'react-admin'
import RichTextInput from 'ra-input-rich-text'

export const PostCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="subtitle" />
      <TextInput source="cover" />
      <RichTextInput source="content" />
    </SimpleForm>
  </Create>
)
