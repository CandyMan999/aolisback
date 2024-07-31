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
        username
        _id
        expoToken
        isLoggedIn
        plan {
          planType
          messages
          messagesSent
          videoMinutes
          videoMinutesUsed
          withAds
          showWhoLikesMe
        }
        pictures {
          _id
          url
          publicId
        }
        blockedUsers {
          _id
        }
        intro
        sex
        location {
          coordinates
        }
        age
        occupation
        singleTime
        lookingFor {
          ageRange {
            lowEnd
            highEnd
          }
          sex
          kids
        }
        drink
        smoke
        marijuana
        drugs
        kids
      }
      receiver {
        _id
        username
        expoToken
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
      participantLeft
      receiver {
        _id
        username
        phoneNumber
        expoToken
      }
      sender {
        _id
        username
        phoneNumber
        expoToken
        pictures {
          _id
          url
          publicId
        }
      }
    }
  }
`;
