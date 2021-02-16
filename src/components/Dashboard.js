import * as React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { Title } from 'react-admin'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
  <Card>
    <Title title="Welcome to the administration" />
    <CardContent>Welcome to the administration</CardContent>
  </Card>
)
