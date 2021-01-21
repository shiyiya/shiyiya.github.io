import gql from 'graphql-tag'

const ql = {
  queryPosts: gql`
    mutation queryPosts(
      $id: String
      $type: Int
      $creatorId: String
      $categoriesId: [String!]
      $tagsId: [String!]
      $offset: Int
      $limit: Int
    ) {
      queryPosts(
        options: {
          id: $id
          type: $type
          creatorId: $creatorId
          categoriesId: $categoriesId
          tagsId: $tagsId
          offset: $offset
          limit: $limit
        }
      ) {
        id
        title
        type
        createdAt
        creator {
          id
          username
        }
      }
    }
  `,
  queryUsers: gql`
    query {
      queryUsers {
        id
        email
        username
        createdAt
      }
    }
  `,
  queryUsersByIds: gql`
    query queryUsersByIds($ids: [String!]) {
      queryUsersByIds(ids: $ids) {
        id
        email
        username
        createdAt
      }
    }
  `,
  queryVideos: gql`
    query queryVideos($offset: Int, $limit: Int) {
      queryVideos(offset: $offset, limit: $limit) {
        id
        title
        createdAt
        bindPost {
          id
          title
        }
      }
    }
  `,
  createPost: gql`
    mutation createPost($title: String!, $content: String) {
      createPost(options: { title: $title, content: $content }) {
        id
      }
    }
  `,
  delPostById: gql`
    mutation delPostById($id: ID!) {
      delPostById(id: $id)
    }
  `,
  queryCategorys: gql`
    query queryCategorys($offset: Int, $limit: Int) {
      queryCategorys(offset: $offset, limit: $limit) {
        id
        name
      }
    }
  `,
  queryTags: gql`
    query queryTags($offset: Int, $limit: Int) {
      queryTags(offset: $offset, limit: $limit) {
        id
        name
      }
    }
  `,
  queryPostById: gql`
    query queryPostById($id: String!) {
      queryPostById(id: $id) {
        id
        title
        type
        createdAt
        creator {
          id
          username
        }
        tags {
          id
          name
        }
        videos {
          id
          title
          playUrl
          episode
        }
      }
    }
  `,
  updatePost: gql`
    mutation updatePost(
      $id: String!
      $title: String!
      $subtitle: String
      $content: String
      $cover: String
    ) {
      updatePost(
        options: {
          id: $id
          title: $title
          subtitle: $subtitle
          content: $content
          cover: $cover
        }
      ) {
        id
      }
    }
  `,
}

export default ql
