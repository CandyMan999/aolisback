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
      kickVotes {
        target {
          _id
        }
        voters {
          _id
        }
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
      replyTo {
        author {
          _id
          username
        }
        text
      }
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
  }
`;

export const BUY_MINUTES_SUBSCRIPTION = gql`
  subscription {
    buyVideoMinutes {
      _id
      plan {
        planType
        messages
        messagesSent
        videoMinutes
        videoMinutesUsed
        likes
        likesSent
        additionalLikes
        additionalMinutes
        additionalMessages
      }
    }
  }
`;

export const BUY_LIKES_SUBSCRIPTION = gql`
  subscription {
    buyLikes {
      _id
      plan {
        planType
        messages
        messagesSent
        videoMinutes
        videoMinutesUsed
        likes
        likesSent
        additionalLikes
        additionalMinutes
        additionalMessages
      }
    }
  }
`;

export const BUY_MESSAGES_SUBSCRIPTION = gql`
  subscription {
    buyMessages {
      _id
      plan {
        planType
        messages
        messagesSent
        videoMinutes
        videoMinutesUsed
        likes
        likesSent
        additionalLikes
        additionalMinutes
        additionalMessages
      }
    }
  }
`;

export const CHANGE_PLAN_SUBSCRIPTION = gql`
  subscription {
    changePlan {
      _id
      name
      terms
      isLoggedIn
      username
      expoToken
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
      phoneNumber
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
        viewed
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
      likedUsers {
        _id
      }
      matchedUsers {
        _id
      }
      usersLikedMe {
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
      googleId
      appleId
    }
  }
`;

export const USER_MATCHED_SUBSCRIPTION = gql`
  subscription {
    userMatched {
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
        expoToken
        location {
          coordinates
          showOnMap
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
      }
      createdAt
    }
  }
`;
