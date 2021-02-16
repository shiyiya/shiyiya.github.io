import React from 'react'
import {
  Show,
  SimpleShowLayout,
  TextField,
  RichTextField,
  DateField,
  ImageField,
  ReferenceField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  Datagrid,
  ArrayField,
  UrlField,
} from 'react-admin'

export const VideoShow = (props) => {
  return (
    <Show {...props} title="Post view">
      <SimpleShowLayout>
        <TextField source="title" />
        <ImageField source="cover" />
        <TextField source="subtitle" />
        <TextField source="episode" />
        <UrlField source="playUrl" />
        <DateField label="Publication date" source="createdAt" />
        <TextField source="bindPost.id" label="post" />
      </SimpleShowLayout>
    </Show>
  )
}
