import gql from "graphql-tag";

export const BaseQuery = gql`
  query Base {
    listPosts {
      id
      title
      author
      content
    }
  }
`;

export const GetItem = gql`
  query GetItem($id: ID!) {
    getPost(id: $id) {
      id
      title
      author
      content
    }
  }
`;

export const Subscription = gql`
  subscription Subscription {
    onDeltaPost {
      id
      title
      author
      content
    }
  }
`;

export const DeltaSync = gql`
  query Delta($lastSync: AWSTimestamp!) {
    listPostsDelta(lastSync: $lastSync) {
      id
      title
      author
      content
      aws_ds
    }
  }
`;
