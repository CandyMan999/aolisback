export const GOOGLE_SIGNUP_MUTATION = `
    mutation( $username: String!, $idToken: String!){
        googleSignup( username: $username, idToken: $idToken){
            _id
            name
            username
            pictures{
                url
                _id
            }
            email
            
        }
    }
`;

export const GOOGLE_LOGIN_MUTATION = `
    mutation($idToken: String!){
        googleLogin( idToken: $idToken){
            _id
            name
            isLoggedIn
            username
            pictures{
              _id
                url
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
            sobrietyTime
            sponsor
            sponsee 
            kids
        }
    }
`;

export const SIGNUP_MUTATION = `
mutation($username: String!, $email: String!, $password: String! ){
    signup(username: $username, email: $email, password: $password){
        _id
        username
        email  
    }
 }
`;

export const LOGIN_MUTATION = `
mutation($username: String!, $password: String! ){
    login(username: $username, password: $password){
        _id
        username
        email
        isLoggedIn
        pictures{
          _id
            url
        }
        location{
          lat
          lng
        }
        intro
        sex
        age
        occupation
        sobrietyTime
        sponsor
        sponsee 
        kids
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
        }
      }
      room{
        _id
        name  
      }
    }
}`;

export const CREATE_PROFILE_MUTATION = `
mutation($_id: ID!, $intro: String!, $age: String!, $sex: Sex!, $occupation: String, $sobrietyTime: String, $sponsor: Boolean, $sponsee: Boolean, $kids: Boolean ){
    createProfile(_id: $_id, intro: $intro, age: $age, sex: $sex, occupation: $occupation, sobrietyTime: $sobrietyTime, sponsor: $sponsor, sponsee: $sponsee, kids: $kids){
      _id
      username
      pictures{
        _id
        url
    }
    location{
      lat
      lng
    }
      intro
      sex
      age
      occupation
      sobrietyTime
      sponsor
      sponsee 
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
  }
    intro
    sex
    age
    occupation
    sobrietyTime
    sponsor
    sponsee 
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
    
    }
    intro
    sex
    age
    occupation
    sobrietyTime
    sponsor
    sponsee 
    kids
    location{
      lat
      lng
    }
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
    }
    intro
    sex
    age
    occupation
    sobrietyTime
    sponsor
    sponsee 
    kids
    location{
      lat
      lng
    }
  }
}
`;
