const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID!
    name: String
    username: String!
    isLoggedIn: Boolean
    email: String
    pictures: [Picture]
    comments: [Comment]
    intro: String
    age: String
    sex: Sex
    kids: String
    occupation: String
    singleTime: String
    drink: Drink
    smoke: Smoke
    marijuana: Marijuana
    drugs: Drugs
    location: Location
    room: Room
    sentVideos: [Video]
    receivedVideos: [Video]
  }
  type Video {
    _id: ID!
    url: String
    sender: User
    receiver: User
    publicId: String
  }

  enum Drugs {
    Recreational
    Yes
    No
  }

  enum Marijuana {
    Friendly
    Unfriendly
  }

  enum Smoke {
    Yes
    Socially
    Never
  }

  enum Drink {
    Yes
    Socially
    Never
  }

  enum Sex {
    Male
    Female
    Gender_Diverse
  }

  type Location {
    lat: Float
    lng: Float
  }

  type Comment {
    _id: ID
    text: String
    createdAt: String
    author: User
    room: Room
  }

  type Picture {
    _id: ID
    url: String
    publicId: String
  }

  type Room {
    _id: ID
    name: String
    users: [User]
    comments: [Comment]
  }

  type AuthSignup {
    user: User
    token: String!
  }

  type Query {
    me: User
    fetchMe(token: String!): User
    getRooms: [Room]
    getComments(roomId: ID!): [Comment]
    findUser(_id: ID!): User
    getUsers: [User]
    getAllUsers: [User]
    getVideos(senderID: ID!, receiverID: ID!): [Video]
  }

  type GoogleAuth {
    user: User!
    token: String!
  }
  type Auth {
    user: User!
    token: String!
  }

  type Mutation {
    googleSignup(username: String!, idToken: String!): GoogleAuth
    signup(username: String!, email: String!, password: String!): AuthSignup
    login(username: String!, password: String!): Auth
    logout(username: String!): User
    googleLogin(idToken: String!): GoogleAuth
    createRoom(name: String!, _id: ID): Room
    changeRoom(roomId: ID!, userId: ID!): Room
    createComment(text: String!, userId: ID!, roomId: ID!): Comment
    createProfile(
      _id: ID!
      intro: String
      age: String
      sex: Sex
      occupation: String
      singleTime: String
      drink: Drink
      smoke: Smoke
      marijuana: Marijuana
      drugs: Drugs
      kids: String
    ): User
    updateLocation(_id: ID!, lat: Float!, lng: Float!): User
    addPhoto(_id: ID!, url: String!, publicId: String!): User
    sendVideo(
      url: String!
      publicId: String!
      receiverID: ID!
      senderID: ID!
    ): User
    deletePhoto(photoId: ID!, userId: ID!): User
  }

  type Subscription {
    roomCreatedOrUpdated: [Room]
    createComment: Comment
    createVideo: Video
  }
`;
