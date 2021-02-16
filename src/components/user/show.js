import React from 'react'
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  ImageField,
} from 'react-admin'

export const UserShow = (props) => {
  console.log(props)
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <DateField label="Publication date" source="createdAt" />
        <TextField source="id" />
        <TextField source="email" />
        <TextField source="username" />
        <TextField source="bio" />
        <ImageField source="avatar" />
      </SimpleShowLayout>
    </Show>
  )
}
