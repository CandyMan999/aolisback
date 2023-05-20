export const GOOGLE_SIGNUP_MUTATION = `
    mutation( $username: String!, $idToken: String!){
        googleSignup( username: $username, idToken: $idToken){
          token
          user{ 
            _id
            name
            isLoggedIn
            username
            pictures{
              _id
              url
              publicId
            }
            location{
              lat
              lng
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

export const GOOGLE_LOGIN_MUTATION = `
    mutation($idToken: String!){
        googleLogin( idToken: $idToken){ 
          token
          user{ 
            _id
            name
            isLoggedIn
            username
            pictures{
              _id
              url
              publicId
            }
            location{
              lat
              lng
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

export const SIGNUP_MUTATION = `
mutation($username: String!, $email: String!, $password: String! ){
    signup(username: $username, email: $email, password: $password){
      token
      user{ 
        _id
        username
        email
      }
    }
 }
`;

export const LOGIN_MUTATION = `
mutation($username: String!, $password: String! ){
    login(username: $username, password: $password){
      token
      user{ 
        _id
        name
        isLoggedIn
        username
        pictures{
          _id
          url
          publicId
        }
        location{
          lat
          lng
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
}`;

export const LOGOUT_MUTATION = `
mutation($username: String!){
	logout(username: $username){
		username
    isLoggedIn
  }
}`;

export const CREATE_ROOM_MUTATION = `
mutation($name: String!, $_id: ID!){
    createRoom(name: $name, _id: $_id){
      _id
      name
        users{
        _id
        username	
       }  
     }
    }
`;

export const CHANGE_ROOM_MUTATION = `
mutation($roomId: ID!, $userId: ID!){
    changeRoom(roomId: $roomId, userId: $userId){
      _id
      name
        users{
        _id
        username	
       }  
     }
    }
`;

export const CREATE_COMMENT_MUTATION = `
mutation($text: String!, $userId: ID!, $roomId: ID!){
    createComment(text: $text, userId: $userId, roomId: $roomId){
      createdAt
      _id
      text
      author{
        username
        pictures{
          _id
          url
          publicId
        }
      }
      room{
        _id
        name  
      }
    }
}`;

export const CREATE_PROFILE_MUTATION = `
mutation($_id: ID!, $intro: String, $age: String, $sex: Sex, $occupation: String, $singleTime: String, $drink: Drink, $smoke: Smoke, $marijuana: Marijuana, $drugs: Drugs, $kids: String ){
    createProfile(_id: $_id, intro: $intro, age: $age, sex: $sex, occupation: $occupation, singleTime: $singleTime, drink: $drink, smoke: $smoke, marijuana: $marijuana, drugs: $drugs, kids: $kids){
      _id
      username
      pictures{
        _id
        url
        publicId
    }
    location{
      lat
      lng
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

export const UPDATE_LOCATION_MUTATION = `
mutation($_id: ID!, $lat: Float!, $lng: Float!){
  updateLocation(_id: $_id, lat: $lat, lng: $lng){
    _id
    username
    pictures{
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
    location{
      lat
      lng
    }
  }
}

`;

export const ADD_PHOTO_MUTATION = `
mutation($_id: ID!, $url: String!, $publicId: String!){
  addPhoto(_id: $_id, url: $url, publicId: $publicId){
    _id
    username
    pictures{
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
    location{
      lat
      lng
    }
  }
}
`;

export const SEND_VIDEO_MUTATION = `
mutation($url: String!, $publicId: String!, $senderID: ID!, $receiverID: ID!){
  sendVideo(url: $url, publicId: $publicId, senderID: $senderID, receiverID: $receiverID){
    _id
    url
    createdAt
    viewed
    flagged
    sender{
      _id
      username
    }
    receiver{
      _id
      username
    }
    publicId
  }
}
`;

export const DELETE_PHOTO_MUTATION = `
mutation($userId: ID!, $photoId: ID!){
  deletePhoto(userId: $userId, photoId: $photoId){
    _id
    username
    pictures{
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
    location{
      lat
      lng
    }
  }
}
`;

export const VIDEO_CHAT_REQUEST = `
mutation($senderID: ID!, $receiverID: ID!, $status: Status!){
	videoChatRequest(senderID: $senderID, receiverID: $receiverID, status: $status){
		status
    createdAt
    sender{
      _id
    }
    receiver{
      _id
    }
  }
}
`;

export const UPDATE_VIDEO_CHAT_REQUEST = `
mutation($_id: ID!, $senderID: ID!, $receiverID: ID!, $status: Status!){
	updateVideoChatRequest(_id: $_id, senderID: $senderID, receiverID: $receiverID, status: $status){
		status
    createdAt
    sender{
      _id
    }
    receiver{
      _id
    }
  }
}
`;

export const BLOCK_USER_MUTATION = `
mutation($userID: ID!, $blockID: ID!){
  block(userID: $userID, blockID: $blockID){
    blockedUsers{
      _id  
    }
  }
}
`;

export const UNBLOCK_USER_MUTATION = `
mutation($userID: ID!, $blockID: ID!){
  unBlock(userID: $userID, blockID: $blockID){
    blockedUsers{
      _id  
    }
  }
}
`;

export const FLAG_VIDEO_MUTATION = `
mutation($_id: ID!, $flagged: Boolean!){
  flagVideo(_id: $_id, flagged: $flagged){
    _id
    url
    createdAt
    viewed
    flagged
    sender{
      _id
      username
    }
    receiver{
      _id
      username
    }
    publicId
  }
}
`;

export const DELETE_VIDEO_MUTATION = `
mutation($_id: ID!){
  deleteVideo(_id: $_id){
    _id
    url
    createdAt
    flagged
    publicId
    sender{
			_id
      username
    }
    receiver{
      _id
      username
    }
  }
 }
`;
