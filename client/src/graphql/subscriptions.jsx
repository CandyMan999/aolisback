import gql from "graphql-tag";

export const ROOM_CREATED_OR_UPDATED_SUBSCRIPTION = gql`
  subscription {
    roomCreatedOrUpdated {
      name
      _id
      users {
        _id
        username
      }
    }
  }
`;

export const CREATE_COMMENT_SUBSCRIPTION = gql`
  subscription {
    createComment {
      createdAt
      _id
      text
      author {
        _id
        username
        pictures {
          url
          _id
          publicId
        }
      }
      room {
        _id
        name
      }
    }
  }
`;

export const CREATE_VIDEO_SUBSCRIPTION = gql`
  subscription {
    createVideo {
      _id
      url
      publicId
      sender {
        _id
        username
      }
      receiver {
        _id
        username
      }
    }
  }
`;
