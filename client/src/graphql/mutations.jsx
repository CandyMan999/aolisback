import gql from "graphql-tag";

export const GOOGLE_SIGNUP_MUTATION = gql`
  mutation ($username: String!, $idToken: String!) {
    googleSignup(username: $username, idToken: $idToken) {
      token
      user {
        _id
        name
        terms
        isLoggedIn
        username
        inCall
        plan {
          planType
          messages
          messagesSent
          videoMinutes
          videoMinutesUsed
          likes
          likesSent
          additionalMinutes
          additionalLikes
          additionalMessages
        }
        pictures {
          _id
          url
          publicId
        }
        location {
          coordinates
          showOnMap
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
        terms
        isLoggedIn
        username
        plan {
          planType
          messages
          messagesSent
          videoMinutes
          videoMinutesUsed
          likes
          likesSent
          additionalMinutes
          additionalLikes
          additionalMessages
        }
        pictures {
          _id
          url
          publicId
        }
        location {
          coordinates
          showOnMap
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
        terms
        isLoggedIn
        plan {
          planType
          messages
          messagesSent
          videoMinutes
          videoMinutesUsed
          likes
          likesSent
          additionalMinutes
          additionalLikes
          additionalMessages
        }
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
        terms
        isLoggedIn
        username
        terms

        plan {
          planType
          messages
          messagesSent
          videoMinutes
          videoMinutesUsed
          likes
          likesSent
          additionalMinutes
          additionalLikes
          additionalMessages
        }
        pictures {
          _id
          url
          publicId
        }
        location {
          coordinates
          showOnMap
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
  mutation ($text: String!, $userId: ID!, $roomId: ID!, $replyToCommentId: ID) {
    createComment(
      text: $text
      userId: $userId
      roomId: $roomId
      replyToCommentId: $replyToCommentId
    ) {
      createdAt
      _id
      text
      replyTo {
        author {
          _id
          username
        }
        text
      }
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
        showOnMap
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
      terms
      marijuana
      drugs
      kids
    }
  }
`;

export const UPDATE_LOCATION_MUTATION = gql`
  mutation (
    $_id: ID!
    $latitude: Float!
    $longitude: Float!
    $showOnMap: Boolean
  ) {
    updateLocation(
      _id: $_id
      latitude: $latitude
      longitude: $longitude
      showOnMap: $showOnMap
    ) {
      coordinates
      showOnMap
    }
  }
`;

export const ADD_PHOTO_MUTATION = gql`
  mutation ($_id: ID!, $url: String!, $publicId: String!) {
    addPhoto(_id: $_id, url: $url, publicId: $publicId) {
      _id
      username
      terms
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
        showOnMap
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
      terms
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
        showOnMap
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
        phoneNumber
        username
        expoToken
        pictures {
          _id
          url
          publicId
        }
      }
      receiver {
        _id
        phoneNumber
        username
        expoToken
      }
    }
  }
`;

export const UPDATE_VIDEO_CHAT_REQUEST = gql`
  mutation (
    $_id: ID!
    $senderID: ID!
    $receiverID: ID!
    $status: Status!
    $participantLeft: Boolean
  ) {
    updateVideoChatRequest(
      _id: $_id
      senderID: $senderID
      receiverID: $receiverID
      status: $status
      participantLeft: $participantLeft
    ) {
      status
      createdAt
      participantLeft
      sender {
        _id
        phoneNumber
        username
        expoToken
        sex
        pictures {
          _id
          url
          publicId
        }
      }
      receiver {
        _id
        phoneNumber
        username
        expoToken
      }
    }
  }
`;

export const SEND_PHONE_NUMBER = gql`
  mutation (
    $phoneNumber: String!
    $username: String!
    $expoToken: String!
    $imageUrl: String
  ) {
    sendPhoneNumber(
      phoneNumber: $phoneNumber
      username: $username
      expoToken: $expoToken
      imageUrl: $imageUrl
    ) {
      status
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
          showOnMap
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
          showOnMap
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

export const DELETE_ACCOUNT_MUTATION = gql`
  mutation {
    deleteAccount {
      status
    }
  }
`;

export const DELETE_SEEDERS_MUTATION = gql`
  mutation {
    deleteSeeders {
      status
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation ($_id: ID!) {
    deleteUser(_id: $_id) {
      status
    }
  }
`;

export const CALL_DURATION_MUTATION = gql`
  mutation ($userID: ID!, $time: Int!) {
    callDuration(userID: $userID, time: $time) {
      user {
        username
        _id
        inCall
        plan {
          planType
          messages
          messagesSent
          videoMinutes
          videoMinutesUsed
          likes
          likesSent
          additionalMinutes
          additionalLikes
          additionalMessages
        }
      }
      outOfTime
    }
  }
`;

export const ACCEPT_TERMS_MUTATION = gql`
  mutation ($accept: Boolean!) {
    termsAgreement(accept: $accept) {
      _id
      name
      terms
      isLoggedIn
      username
      inCall
      plan {
        planType
        messages
        messagesSent
        videoMinutes
        videoMinutesUsed
        likes
        likesSent
        additionalMinutes
        additionalLikes
        additionalMessages
      }
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
        showOnMap
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
            showOnMap
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
            showOnMap
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

export const LIKE_MUTATION = gql`
  mutation ($userID: ID!, $likeID: ID!) {
    like(userID: $userID, likeID: $likeID) {
      user {
        username
        plan {
          planType
          messages
          messagesSent
          videoMinutes
          videoMinutesUsed
          likes
          likesSent
          additionalMinutes
          additionalLikes
          additionalMessages
        }
        likedUsers {
          _id
        }
        matchedUsers {
          _id
        }
      }
      isMatch
      matchID
    }
  }
`;

export const UNLIKE_MUTATION = gql`
  mutation ($userID: ID!, $unLikeID: ID!) {
    unLike(userID: $userID, unLikeID: $unLikeID) {
      username
      plan {
        planType
        messages
        messagesSent
        videoMinutes
        videoMinutesUsed
        likes
        likesSent
        additionalMinutes
        additionalLikes
        additionalMessages
      }
      likedUsers {
        _id
      }
      matchedUsers {
        _id
      }
    }
  }
`;

export const EARN_REWARD_MUTATION = gql`
  mutation earnReward($userId: ID!, $rewardType: RewardType!) {
    earnReward(userId: $userId, rewardType: $rewardType) {
      _id
      username
      plan {
        planType
        messages
        messagesSent
        videoMinutes
        videoMinutesUsed
        likes
        likesSent
        additionalMinutes
        additionalLikes
        additionalMessages
      }
    }
  }
`;
export const FLAG_PHOTO_MUTATION = gql`
  mutation ($url: String!, $publicId: String!, $flaggedUserID: ID!) {
    flagPhoto(url: $url, publicId: $publicId, flaggedUserID: $flaggedUserID) {
      url
      flagged
      publicId
      user {
        username
        _id
      }
    }
  }
`;

export const UNFLAG_VIDEO = gql`
  mutation UnflagVideo($videoId: ID!) {
    unflagVideo(videoId: $videoId) {
      _id
      flagged
    }
  }
`;

export const UNFLAG_PICTURE = gql`
  mutation UnflagPicture($pictureId: ID!) {
    unflagPicture(pictureId: $pictureId) {
      _id
      flagged
    }
  }
`;

export const BAN_USER = gql`
  mutation BanUser($userId: ID!) {
    banUser(userId: $userId) {
      _id
      isBanned
    }
  }
`;

export const ADD_TO_QUEUE_MUTATION = gql`
  mutation addToQueue($userId: ID!, $sex: Sex!, $lookingFor: Sex!) {
    addToQueue(userId: $userId, sex: $sex, lookingFor: $lookingFor) {
      userId
      sex
      lookingFor
      status
      pairedUser {
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
        pictures {
          _id
          url
          publicId
        }
      }
      createdAt
    }
  }
`;

export const MATCH_USER_MUTATION = gql`
  mutation ($userId: ID!) {
    matchUser(userId: $userId) {
      userId
      sex
      lookingFor
      status
      pairedUser {
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
        pictures {
          _id
          url
          publicId
        }
      }
      createdAt
    }
  }
`;

export const UPDATE_MATCH_STATUS_MUTATION = gql`
  mutation UpdateMatchStatus($userId: ID!, $status: SpeedDateStatus!) {
    updateMatchStatus(userId: $userId, status: $status) {
      message
    }
  }
`;

export const REMOVE_FROM_QUEUE = gql`
  mutation ($userId: ID!, $isLoggedIn: Boolean) {
    removeFromQueue(userId: $userId, isLoggedIn: $isLoggedIn) {
      message
    }
  }
`;
