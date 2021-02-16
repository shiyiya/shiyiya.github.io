import React from 'react'
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  Datagrid,
  DateField,
  EditButton,
  ReferenceManyField,
  TextField,
} from 'react-admin'
import RichTextInput from 'ra-input-rich-text'

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" />
    </SimpleForm>
  </Create>
)
