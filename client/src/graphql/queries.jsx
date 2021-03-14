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
      }
    }
    room{
      _id
    }
  }
}
`;
