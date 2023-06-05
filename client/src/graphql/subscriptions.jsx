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
      createdAt
      flagged
      viewed
      sender {
        _id
        username
        pictures {
          publicId
        }
      }
      receiver {
        _id
        username
        pictures {
          publicId
        }
      }
    }
  }
`;

export const VIDEO_CHAT_REQUEST = gql`
  subscription {
    videoChatRequest {
      _id
      createdAt
      status
      receiver {
        _id
        username
      }
      sender {
        _id
        username
        sex
        age
        blockedUsers {
          _id
        }
        pictures {
          url
          publicId
          _id
        }
        singleTime
        kids
        intro
        occupation
        drink
        smoke
        marijuana
        drugs
        location {
          coordinates
        }
      }
    }
  }
`;
