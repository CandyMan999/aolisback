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
    likedUsers: [User]
    matchedUsers: [User]
    usersLikedMe: [User]
    chatRequest: ChatRequest
    lookingFor: LookingFor
    expoToken: String
    terms: Boolean
    phoneNumber: String
    isBanned: Boolean
    profileComplete: Boolean
    inCall: Boolean
    plan: Plan
    lastMatchNotification: String
  }

  type Plan {
    planType: PlanType
    messages: Int
    messagesSent: Int
    videoMinutes: Int
    videoMinutesUsed: Int
    withAds: Boolean
    showWhoLikesMe: Boolean
  }

  enum PlanType {
    Free
    Premium
    Unlimited
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
    messagesSent: Int
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

    offer: String
    answer: String
    candidates: [String]
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

  type CallDuration {
    user: User
    outOfTime: Boolean
  }

  type Account {
    status: Boolean!
  }

  type NumberSentStatus {
    status: Boolean!
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
    getLikedUsers(userID: ID!): [User]
    getUsersWhoLikedMe(userID: ID!): [User]
    getMatchedUsers(userID: ID!): [User]
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
    appleLogin(appleId: String!): Auth
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
      offer: String
      answer: String
    ): ChatRequest
    updateVideoChatRequest(
      _id: ID!
      senderID: ID!
      receiverID: ID!
      status: Status!

      offer: String
      answer: String
      candidate: String
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
    deleteAccount: Account
    termsAgreement(accept: Boolean!): User
    addPhone(_id: ID!, phoneNumber: String!, authCode: Float): User
    sendPhoneNumber(
      expoToken: String!
      username: String!
      phoneNumber: String!
      imageUrl: String
    ): NumberSentStatus
    callDuration(userID: ID!, time: Int!): CallDuration
    like(userID: ID!, likeID: ID!): User
    unLike(userID: ID!, unLikeID: ID!): User
  }

  type Subscription {
    roomCreatedOrUpdated: [Room]
    createComment: Comment
    createVideo: Video
    videoChatRequest: ChatRequest
  }
`;
