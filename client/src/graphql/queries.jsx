import gql from "graphql-tag";

export const GET_ROOMS_QUERY = gql`
  query {
    getRooms {
      name
      _id
      users {
        _id
        username
      }
      comments {
        _id
        createdAt
        text
      }
    }
  }
`;

export const GET_COMMENTS_QUERY = gql`
  query ($roomId: ID!) {
    getComments(roomId: $roomId) {
      _id
      createdAt
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
      }
    }
  }
`;

export const FIND_USER_QUERY = gql`
  query ($_id: ID!) {
    findUser(_id: $_id) {
      _id
      username
      email
      lookingFor {
        ageRange {
          lowEnd
          highEnd
        }
        sex
        kids
      }
      isLoggedIn
      blockedUsers {
        _id
      }
      pictures {
        url
        _id
        publicId
      }
      intro
      sex
      age
      occupation
      singleTime
      drink
      smoke
      marijuana
      drugs
      kids
      location {
        coordinates
      }
    }
  }
`;

export const GET_USERS_MAP_QUERY = gql`
  query ($latitude: Float!, $longitude: Float!) {
    getUsersMap(latitude: $latitude, longitude: $longitude) {
      _id
      username
      isLoggedIn
      email
      lookingFor {
        ageRange {
          lowEnd
          highEnd
        }
        sex
        kids
      }
      blockedUsers {
        _id
      }
      pictures {
        url
        _id
        publicId
      }
      intro
      sex
      age
      room {
        _id
        name
      }
      occupation
      singleTime
      drink
      smoke
      marijuana
      drugs
      kids
      location {
        coordinates
      }
    }
  }
`;

export const FETCH_ME = gql`
  query ($token: String!) {
    fetchMe(token: $token) {
      _id
      name
      terms
      isLoggedIn
      username
      lookingFor {
        ageRange {
          lowEnd
          highEnd
        }
        sex
        kids
      }
      pictures {
        _id
        url
        publicId
      }
      location {
        coordinates
      }
      sentVideos {
        _id
        url
        publicId
        createdAt
        sender {
          username
          _id
          pictures {
            _id
            url
            publicId
          }
        }
        receiver {
          _id
          username
          pictures {
            _id
            url
            publicId
          }
        }
      }
      receivedVideos {
        _id
        url
        publicId
        createdAt
        flagged
        viewed
        sender {
          username
          _id
          isLoggedIn
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
          lookingFor {
            ageRange {
              lowEnd
              highEnd
            }
            sex
            kids
          }
          singleTime
          drink
          smoke
          marijuana
          drugs
          kids
        }
        receiver {
          _id
          username
          intro
          sex
          age
          occupation
          singleTime
          drink
          smoke
          marijuana
          drugs
          kids
          location {
            coordinates
          }
          pictures {
            _id
            url
            publicId
          }
        }
      }
      blockedUsers {
        _id
      }
      email
      intro
      sex
      age
      occupation
      singleTime
      drink
      smoke
      marijuana
      drugs
      kids
    }
  }
`;

export const GET_ALL_USERS = gql`
  query ($latitude: Float!, $longitude: Float!) {
    getAllUsers(latitude: $latitude, longitude: $longitude) {
      _id
      name
      username
      lookingFor {
        ageRange {
          lowEnd
          highEnd
        }
        sex
        kids
      }
      room {
        _id
        name
      }
      blockedUsers {
        _id
      }
      pictures {
        _id
        url
        publicId
      }
      isLoggedIn
      location {
        coordinates
      }
      intro
      sex
      age
      occupation
      singleTime
      drink
      smoke
      marijuana
      drugs
      kids
    }
  }
`;

export const GET_VIDEOS_QUERY = gql`
  query ($senderID: ID!, $receiverID: ID!) {
    getVideos(senderID: $senderID, receiverID: $receiverID) {
      _id
      url
      publicId
      createdAt
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
