const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID!
    name: String
    username: String!
    email: String
    pictures: [Picture]
    comments: [Comment]
    intro: String
    age: String
    sex: Sex
    kids: Boolean
    occupation: String
    sobrietyTime: String
    sponsor: Boolean
    sponsee: Boolean
  }
  enum Sex {
    male
    female
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
  }

  type Room {
    _id: ID
    name: String
    users: [User]
    comments: [Comment]
  }

  type Auth {
    _id: ID
    email: String
    name: String
    username: String
    pictures: [Picture]
  }

  type AuthSignup {
    _id: ID
    username: String
    email: String
  }

  type Query {
    me: User
    getRooms: [Room]
    getComments(roomId: ID!): [Comment]
    findUser(_id: ID!): User
  }

  type Mutation {
    googleSignup(username: String!, idToken: String!): Auth
    signup(username: String!, email: String!, password: String!): AuthSignup
    login(username: String!, password: String!): User
    googleLogin(idToken: String!): User
    createRoom(name: String!, _id: ID): Room
    changeRoom(roomId: ID!, userId: ID!): Room
    createComment(text: String!, userId: ID!, roomId: ID!): Comment
    createProfile(
      _id: ID!
      intro: String!
      age: String!
      sex: Sex!
      occupation: String
      sobrietyTime: String
      sponsor: Boolean
      sponsee: Boolean
      kids: Boolean
    ): User
  }

  type Subscription {
    roomCreatedOrUpdated: [Room]
    createComment: Comment
  }
`;
