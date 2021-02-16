import gql from 'graphql-tag'

const ql = {
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
  queryUserById: gql`
    query queryUserById($id: String!) {
      queryUserById(id: $id) {
        id
        email
        username
        createdAt
        avatar
        bio
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
  updateUser: gql`
    query updateUser(
      $id: String!
      $email: String!
      $username: String
      $avatar: String
      $bio: String
    ) {
      updateUser(
        options: {
          id: $id
          email: $email
          username: $username
          avatar: $avatar
          bio: $bio
        }
      ) {
        id
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
  queryVideoById: gql`
    query queryVideoById($id: String!) {
      queryVideoById(id: $id) {
        id
        title
        createdAt
        subtitle
        playUrl
        cover
        episode
        bindPost {
          id
          title
        }
      }
    }
  `,
  updateVideo: gql`
    mutation updateVideo(
      $id: String!
      $title: String!
      $subtitle: String
      $cover: String
      $playUrl: String!
      $episode: Int
    ) {
      updateVideo(
        options: {
          id: $id
          title: $title
          subtitle: $subtitle
          cover: $cover
          playUrl: $playUrl
          episode: $episode
        }
      ) {
        id
      }
    }
  `,
  createVideo: gql`
    mutation createVideo(
      $title: String!
      $subtitle: String
      $cover: String
      $playUrl: String!
      $episode: Int
      $bindPostId: String!
    ) {
      createVideo(
        options: {
          title: $title
          subtitle: $subtitle
          cover: $cover
          playUrl: $playUrl
          episode: $episode
          bindPostId: $bindPostId
        }
      ) {
        id
      }
    }
  `,

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
