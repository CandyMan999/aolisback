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
    }
    intro
    sex
    age
    occupation
    sobrietyTime
    sponsor
    sponsee 
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
    }
  }
}

`;
