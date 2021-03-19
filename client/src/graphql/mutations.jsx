export const GOOGLE_SIGNUP_MUTATION = `
    mutation( $username: String!, $idToken: String!){
        googleSignup( username: $username, idToken: $idToken){
            _id
            name
            username
            pictures{
                url
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
            username
            pictures{
                url
            }
            email
            
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
        pictures{
            url
        }
     
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
