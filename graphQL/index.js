const rootDefs = require("./rootDefs.js");

const {
  roomCreatedOrUpdatedSubscription,
  createCommentSubscription,
  createVideoSubscription,
} = require("./subscription/subscription");

const {
  fetchMeResolver,
  getRoomsResolver,
  getCommentsResolver,
  findUserResolver,
  getUsersMapResolver,
  getAllUsersResolver,
  getVideosResolver,
} = require("./queries");
const {
  createRoomResolver,
  changeRoomResolver,
  googleSignupResolver,
  googleLoginResolver,
  signupResolver,
  loginResolver,
  logoutResolver,
  createCommentResolver,
  createProfileResolver,
  updateLocationResolver,
  addPhotoResolver,
  sendVideoResolver,
  deletePhotoResolver,
} = require("./mutations");

const typeDefs = [rootDefs];

const resolvers = {
  Subscription: {
    roomCreatedOrUpdated: roomCreatedOrUpdatedSubscription,
    createComment: createCommentSubscription,
    createVideo: createVideoSubscription,
  },
  Query: {
    fetchMe: fetchMeResolver,
    getRooms: getRoomsResolver,
    getComments: getCommentsResolver,
    findUser: findUserResolver,
    getUsersMap: getUsersMapResolver,
    getAllUsers: getAllUsersResolver,
    getVideos: getVideosResolver,
  },
  Mutation: {
    createRoom: createRoomResolver,
    changeRoom: changeRoomResolver,
    googleSignup: googleSignupResolver,
    googleLogin: googleLoginResolver,
    signup: signupResolver,
    login: loginResolver,
    logout: logoutResolver,
    createComment: createCommentResolver,
    createProfile: createProfileResolver,
    updateLocation: updateLocationResolver,
    addPhoto: addPhotoResolver,
    sendVideo: sendVideoResolver,
    deletePhoto: deletePhotoResolver,
  },
};

module.exports = { typeDefs, resolvers };
