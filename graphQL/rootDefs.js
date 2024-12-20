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
    likes: Int
    likesSent: Int
    additionalMinutes: Int
    additionalLikes: Int
    additionalMessages: Int
  }
  type Queue {
    userId: ID!
    sex: Sex
    lookingFor: Sex
    status: SpeedDateStatus
    pairedUser: User
    createdAt: String
    location: Location
    previousMatches: [ID]
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
    showOnMap: Boolean
  }

  type Comment {
    _id: ID
    text: String
    createdAt: String
    author: User
    room: Room
    replyTo: Comment
  }

  type Picture {
    _id: ID
    url: String
    publicId: String
    flagged: Boolean
    user: User
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
    participantLeft: Boolean
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

  type StatusMessage {
    message: String
  }
  type resetPassword {
    message: String
    username: String
  }

  enum SpeedDateStatus {
    Waiting
    Deciding
    Connected
    Cancel
    Accept
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
  type Like {
    user: User!
    isMatch: Boolean!
    matchID: String
  }

  type Query {
    me: User
    fetchMe(token: String!): User
    getRooms: [Room]
    getComments(roomId: ID!): [Comment]
    findUser(_id: ID!): User
    getUsersMap(latitude: Float!, longitude: Float!): [User]
    getAllUsers(
      latitude: Float!
      longitude: Float!
      limit: Int
      skip: Int
    ): [User]
    getVideos(senderID: ID!, receiverID: ID!): [Video]
    getLikedUsers(userID: ID!): [User]
    getUsersWhoLikedMe(userID: ID!): [User]
    getMatchedUsers(userID: ID!): [User]
    getFlaggedVideos: [Video]
    getFlaggedPictures: [Picture]
    getRealUsers: [User]
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
    createComment(
      text: String!
      userId: ID!
      roomId: ID!
      replyToCommentId: ID
    ): Comment
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
    updateLocation(
      _id: ID!
      latitude: Float!
      longitude: Float!
      showOnMap: Boolean
    ): Location
    addPhoto(_id: ID!, url: String!, publicId: String!): User
    flagPhoto(flaggedUserID: ID!, url: String!, publicId: String!): Picture
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
      participantLeft: Boolean
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
    sendTwoFactor(phoneNumber: String!, authCode: Float): resetPassword
    sendPhoneNumber(
      expoToken: String!
      username: String!
      phoneNumber: String!
      imageUrl: String
    ): NumberSentStatus
    callDuration(userID: ID!, time: Int!): CallDuration
    like(userID: ID!, likeID: ID!): Like
    unLike(userID: ID!, unLikeID: ID!): User
    unflagVideo(videoId: ID!): Video
    unflagPicture(pictureId: ID!): Picture
    banUser(userId: ID!): User
    changePlan(_id: ID!, planType: PlanType!): User
    buyLikes(_id: ID!, numberLikes: Int!): User
    buyMessages(_id: ID!, numberMessages: Int!): User
    buyVideoMinutes(_id: ID!, numberMinutes: Int!): User
    deleteUser(_id: ID!): Account
    deleteSeeders: Account
    addToQueue(userId: ID!, sex: Sex!, lookingFor: Sex!): Queue
    matchUser(userId: ID!): Queue
    updateMatchStatus(userId: ID!, status: SpeedDateStatus): StatusMessage
    removeFromQueue(userId: ID!, isLoggedIn: Boolean): StatusMessage
    resetPassword(username: String!, password: String!): Auth
  }

  type Subscription {
    roomCreatedOrUpdated: [Room]
    createComment: Comment
    createVideo: Video
    videoChatRequest: ChatRequest
    changePlan: User
    buyLikes: User
    buyMessages: User
    buyVideoMinutes: User
    flagUser: Picture
    userMatched: Queue
  }
`;
