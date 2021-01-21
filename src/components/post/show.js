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

export const PostShow = (props) => {
  console.log(props)
  return (
    <Show {...props} title="Post view">
      <SimpleShowLayout>
        <TextField source="title" />
        <TextField source="subtitle" />
        <RichTextField source="content" />
        <ImageField src="cover" addLabel={false} />
        <ReferenceField label="Creator" source="creator.id" reference="User">
          <TextField source="username" />
        </ReferenceField>
        <ReferenceArrayField label="Tags" reference="tags" source="Tag">
          <SingleFieldList>
            <ChipField source="name" />
          </SingleFieldList>
        </ReferenceArrayField>
        <ArrayField source="videos">
          <Datagrid>
            <TextField source="episode" />
            <TextField source="title" />
            <UrlField source="playUrl" />
          </Datagrid>
        </ArrayField>
        <DateField label="Publication date" source="createdAt" />
      </SimpleShowLayout>
    </Show>
  )
}
