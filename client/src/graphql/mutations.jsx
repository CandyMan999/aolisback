import gql from "graphql-tag";

export const GOOGLE_SIGNUP_MUTATION = gql`
  mutation ($username: String!, $idToken: String!) {
    googleSignup(username: $username, idToken: $idToken) {
      token
      user {
        _id
        name
        isLoggedIn
        username
        pictures {
          _id
          url
          publicId
        }
        location {
          coordinates
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
  }
`;

export const GOOGLE_LOGIN_MUTATION = gql`
  mutation ($idToken: String!) {
    googleLogin(idToken: $idToken) {
      token
      user {
        _id
        name
        isLoggedIn
        username
        pictures {
          _id
          url
          publicId
        }
        location {
          coordinates
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
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation ($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        name
        isLoggedIn
        username
        pictures {
          _id
          url
          publicId
        }
        location {
          coordinates
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
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation ($username: String!) {
    logout(username: $username) {
      username
      isLoggedIn
    }
  }
`;

export const CREATE_ROOM_MUTATION = gql`
  mutation ($name: String!, $_id: ID!) {
    createRoom(name: $name, _id: $_id) {
      _id
      name
      users {
        _id
        username
      }
    }
  }
`;

export const CHANGE_ROOM_MUTATION = gql`
  mutation ($roomId: ID!, $userId: ID!) {
    changeRoom(roomId: $roomId, userId: $userId) {
      _id
      name
      users {
        _id
        username
      }
    }
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation ($text: String!, $userId: ID!, $roomId: ID!) {
    createComment(text: $text, userId: $userId, roomId: $roomId) {
      createdAt
      _id
      text
      author {
        username
        pictures {
          _id
          url
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

export const CREATE_PROFILE_MUTATION = gql`
  mutation (
    $_id: ID!
    $intro: String
    $age: String
    $sex: Sex
    $occupation: String
    $singleTime: String
    $drink: Drink
    $smoke: Smoke
    $marijuana: Marijuana
    $drugs: Drugs
    $kids: String
  ) {
    createProfile(
      _id: $_id
      intro: $intro
      age: $age
      sex: $sex
      occupation: $occupation
      singleTime: $singleTime
      drink: $drink
      smoke: $smoke
      marijuana: $marijuana
      drugs: $drugs
      kids: $kids
    ) {
      _id
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
      blockedUsers {
        _id
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

export const UPDATE_LOCATION_MUTATION = gql`
  mutation ($_id: ID!, $latitude: Float!, $longitude: Float!) {
    updateLocation(_id: $_id, latitude: $latitude, longitude: $longitude) {
      coordinates
    }
  }
`;

export const ADD_PHOTO_MUTATION = gql`
  mutation ($_id: ID!, $url: String!, $publicId: String!) {
    addPhoto(_id: $_id, url: $url, publicId: $publicId) {
      _id
      username
      pictures {
        _id
        url
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
      lookingFor {
        ageRange {
          lowEnd
          highEnd
        }
        sex
        kids
      }
      location {
        coordinates
      }
    }
  }
`;

export const SEND_VIDEO_MUTATION = gql`
  mutation (
    $url: String!
    $publicId: String!
    $senderID: ID!
    $receiverID: ID!
  ) {
    sendVideo(
      url: $url
      publicId: $publicId
      senderID: $senderID
      receiverID: $receiverID
    ) {
      _id
      url
      createdAt
      viewed
      flagged
      sender {
        _id
        username
      }
      receiver {
        _id
        username
      }
      publicId
    }
  }
`;

export const DELETE_PHOTO_MUTATION = gql`
  mutation ($userId: ID!, $photoId: ID!) {
    deletePhoto(userId: $userId, photoId: $photoId) {
      _id
      username
      pictures {
        _id
        url
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
      lookingFor {
        ageRange {
          lowEnd
          highEnd
        }
        sex
        kids
      }
      location {
        coordinates
      }
    }
  }
`;

export const VIDEO_CHAT_REQUEST = gql`
  mutation ($senderID: ID!, $receiverID: ID!, $status: Status!) {
    videoChatRequest(
      senderID: $senderID
      receiverID: $receiverID
      status: $status
    ) {
      status
      createdAt
      sender {
        _id
      }
      receiver {
        _id
      }
    }
  }
`;

export const UPDATE_VIDEO_CHAT_REQUEST = gql`
  mutation ($_id: ID!, $senderID: ID!, $receiverID: ID!, $status: Status!) {
    updateVideoChatRequest(
      _id: $_id
      senderID: $senderID
      receiverID: $receiverID
      status: $status
    ) {
      status
      createdAt
      sender {
        _id
      }
      receiver {
        _id
      }
    }
  }
`;

export const BLOCK_USER_MUTATION = gql`
  mutation ($userID: ID!, $blockID: ID!) {
    block(userID: $userID, blockID: $blockID) {
      blockedUsers {
        _id
      }
    }
  }
`;

export const UNBLOCK_USER_MUTATION = gql`
  mutation ($userID: ID!, $blockID: ID!) {
    unBlock(userID: $userID, blockID: $blockID) {
      blockedUsers {
        _id
      }
    }
  }
`;

export const FLAG_VIDEO_MUTATION = gql`
  mutation ($_id: ID!, $flagged: Boolean!) {
    flagVideo(_id: $_id, flagged: $flagged) {
      _id
      url
      createdAt
      viewed
      flagged
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
      }
      publicId
    }
  }
`;

export const VIEWED_VIDEO_MUTATION = gql`
  mutation ($_id: ID!, $viewed: Boolean!) {
    viewVideo(_id: $_id, viewed: $viewed) {
      _id
      url
      createdAt
      viewed
      flagged
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
        lookingFor {
          ageRange {
            lowEnd
            highEnd
          }
          sex
          kids
        }
        occupation
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
      }
      publicId
    }
  }
`;

export const DELETE_VIDEO_MUTATION = gql`
  mutation ($_id: ID!) {
    deleteVideo(_id: $_id) {
      _id
      url
      createdAt
      flagged
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

export const LOOKING_FOR_MUTATION = gql`
  mutation (
    $_id: ID!
    $lowEnd: Float
    $highEnd: Float
    $kids: String
    $sex: Sex
  ) {
    lookingFor(
      _id: $_id
      lowEnd: $lowEnd
      highEnd: $highEnd
      kids: $kids
      sex: $sex
    ) {
      ageRange {
        lowEnd
        highEnd
      }
      sex
      kids
    }
  }
`;
