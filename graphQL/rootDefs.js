const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID!
    name: String
    googleId: String
    appleId: String
    username: String!
    isLoggedIn: Boolean
    seeder: Boolean
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
    blockedUsers: [User]
    chatRequest: ChatRequest
    lookingFor: LookingFor
    expoToken: String
  }

  type Video {
    _id: ID!
    url: String
    sender: User
    createdAt: String
    receiver: User
    publicId: String
    viewed: Boolean
    flagged: Boolean
  }

  type LookingFor {
    ageRange: AgeRange
    kids: String
    sex: Sex
  }

  type AgeRange {
    lowEnd: Int
    highEnd: Int
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
    type: String
    coordinates: [Float]
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

  type ChatRequest {
    _id: ID
    createdAt: String
    status: Status
    sender: User
    receiver: User
  }

  enum Status {
    Pending
    Accept
    Decline
    Block
    Cancel
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
    getUsersMap(latitude: Float!, longitude: Float!): [User]
    getAllUsers(latitude: Float!, longitude: Float!): [User]
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
    googleAppLogin(googleId: String!): GoogleAuth
    appleSignup(
      email: String
      name: String
      appleId: String!
      username: String!
    ): Auth
    googleAppSignup(
      email: String!
      name: String!
      username: String!
      picture: String!
      googleId: String!
    ): GoogleAuth
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
    updateLocation(_id: ID!, latitude: Float!, longitude: Float!): Location
    addPhoto(_id: ID!, url: String!, publicId: String!): User
    sendVideo(
      url: String!
      publicId: String!
      receiverID: ID!
      senderID: ID!
    ): Video
    deletePhoto(photoId: ID!, userId: ID!): User
    videoChatRequest(
      senderID: ID!
      receiverID: ID!
      status: Status!
    ): ChatRequest
    updateVideoChatRequest(
      _id: ID!
      senderID: ID!
      receiverID: ID!
      status: Status!
    ): ChatRequest
    lookingFor(
      _id: ID!
      lowEnd: Float
      highEnd: Float
      kids: String
      sex: Sex
    ): LookingFor
    block(userID: ID!, blockID: ID!): User
    unBlock(userID: ID!, blockID: ID!): User
    flagVideo(_id: ID!, flagged: Boolean!): Video
    deleteVideo(_id: ID!): [Video]
    viewVideo(_id: ID!, viewed: Boolean!): Video
    getExpoToken(token: String!, userId: ID!): User
  }

  type Subscription {
    roomCreatedOrUpdated: [Room]
    createComment: Comment
    createVideo: Video
    videoChatRequest: ChatRequest
  }
`;
