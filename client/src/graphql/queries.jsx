export const GET_ROOMS_QUERY = `
query{
    getRooms{
          name
      _id
        users{
        _id
        username
      
      }
      comments{
        _id
        createdAt
        text
        
      }
    }
  }
`;

export const GET_COMMENTS_QUERY = `
query($roomId: ID!){
	getComments(roomId: $roomId){
    _id
    createdAt
    text
    author{
      _id
      username
      pictures{
        url
        _id
        publicId
      }
    }
    room{
      _id
    }
  }
}
`;

export const FIND_USER_QUERY = `
query($_id: ID!){
  findUser(_id: $_id){
    _id
    username
    email
    pictures{
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
      lat
      lng
    }
  }
}
`;

export const GET_ALL_USERS_QUERY = `
query{
  getUsers{
    _id
    username
    isLoggedIn
    room{
      _id
      name
    }
    location{
      lat
      lng
    }
    pictures{
      url
      _id
      publicId
    }
  }
}
`;

export const FETCH_ME = `
query($token: String!){
  fetchMe(token: $token){
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
              sentVideos{
                _id
								url
                publicId
               	sender{
                  username
                  _id
                  pictures{
                    _id
                    url
                    publicId
                  }
                }
                receiver{
                  _id
                  username
                  pictures{
									  _id
                    url
                    publicId
                  }
                } 
              }
    					receivedVideos{
                _id
								url
                publicId
               	sender{
                  username
                  _id
                  pictures{
									  _id
                    url
                    publicId
                  }
                }
                receiver{
                  _id
                  username
                  pictures{
									  _id
                    url
                    publicId
                  }
                } 
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

export const GET_ALL_USERS = `
query{
  getAllUsers{
    _id
    name
    username
    room{
      _id
      name
    }
    pictures{
      _id
      url
      publicId
    }
    isLoggedIn
    location{
      lat
      lng
    }
    age
    sex
    intro
  }
}`;

export const GET_VIDEOS_QUERY = `
query($senderID: ID!, $receiverID: ID!){
  getVideos(senderID: $senderID, receiverID: $receiverID){
   _id
   url
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
}`;
