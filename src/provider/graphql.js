import buildApolloClient, {
  buildQuery as buildQueryFactory,
} from 'ra-data-graphql-simple'
import {
  CREATE,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  GET_ONE,
} from 'ra-core'
import { DELETE, UPDATE } from 'react-admin'
import gqler from '../graphql/index'

const customBuildQuery = (introspectionResults) => {
  const buildQuery = buildQueryFactory(introspectionResults)

  return (type, resource, params) => {
    console.log(type, resource, params)

    if (type === GET_ONE) {
      return {
        query: gqler['query' + resource + 'ById'],
        variables: { id: params.id },
        parseResponse: ({ data }) => {
          const result = data['query' + resource + 'ById']

          console.log('GET_ONE result', result)

          if (result) {
            return { data: result }
          } else {
            return { data: null }
          }
        },
      }
    }

    if (type === CREATE) {
      return {
        query: gqler['create' + resource],
        variables: params.data,
        parseResponse: ({ data }) => {
          const result = data['create' + resource]

          console.log('result', result)

          if (result) {
            return { data: result, total: 99 }
          } else {
            return { data: [], total: 0 }
          }
        },
      }
    }

    if (type === GET_MANY) {
      return {
        query: gqler['query' + resource + 'sByIds'],
        variables: { ids: params.ids },
        parseResponse: ({ data }) => {
          const result = data['query' + resource + 'sByIds']

          console.log('GET_MANY result', result)

          if (result) {
            return { data: result, total: 99 }
          } else {
            return { data: [], total: 0 }
          }
        },
      }
    }

    if (type === GET_MANY_REFERENCE) {
    }

    if (type === GET_LIST) {
      return {
        query: gqler['query' + resource + 's'],
        variables: {
          offset: params.pagination.page - 1,
          limit: params.pagination.perPage,
        },
        parseResponse: ({ data }) => {
          const result = data['query' + resource + 's']

          console.log('GET_LIST result', result)

          if (result) {
            const len = result.length
            return {
              data: result,
              total: len < params.pagination.perPage ? len : 99,
            }
          } else {
            return { data: [], total: 0 }
          }
        },
      }
    }

    if (type === DELETE) {
      return {
        query: gqler['del' + resource + 'ById'],
        variables: { id: params.id },
        parseResponse: ({ data }) => {
          const result = data['del' + resource + 'ById']

          console.log('DELETE result', result)

          if (result) {
            return { data: result, total: 99 }
          } else {
            throw new Error(`Could not delete ${resource}`)
          }
        },
      }
    }
    if (type === UPDATE) {
      return {
        query: gqler['update' + resource],
        variables: { ...params.data },
        parseResponse: ({ data }) => {
          const result = data['update' + resource]

          console.log('UPDATE result', result)

          if (result) {
            return { data: result }
          } else {
            throw new Error(`Could not delete ${resource}`)
          }
        },
      }
    }

    return buildQuery(type, resource, params)
  }
}

const _build = () =>
  buildApolloClient({
    clientOptions: { uri: 'http://localhost:4000/graphql' },
    buildQuery: customBuildQuery,
  })

export default _build
