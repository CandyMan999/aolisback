const rootDefs = require("./rootDefs.js");

const {
  roomCreatedOrUpdatedSubscription,
  createCommentSubscription,
  createVideoSubscription,
  videoChatRequestSubscription,
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
  videoChatRequestResolver,
  updateVideoChatRequestResolver,
  blockResolver,
  unBlockResolver,
  flagVideoResolver,
  deleteVideoResolver,
  lookingForResolver,
  viewVideoResolver,
  googleAppLoginResolver,
  googleAppSignupResolver,
} = require("./mutations");

const typeDefs = [rootDefs];

const resolvers = {
  Subscription: {
    roomCreatedOrUpdated: roomCreatedOrUpdatedSubscription,
    createComment: createCommentSubscription,
    createVideo: createVideoSubscription,
    videoChatRequest: videoChatRequestSubscription,
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
    videoChatRequest: videoChatRequestResolver,
    updateVideoChatRequest: updateVideoChatRequestResolver,
    block: blockResolver,
    unBlock: unBlockResolver,
    flagVideo: flagVideoResolver,
    deleteVideo: deleteVideoResolver,
    lookingFor: lookingForResolver,
    viewVideo: viewVideoResolver,
    googleAppLogin: googleAppLoginResolver,
    googleAppSignup: googleAppSignupResolver,
  },
};

module.exports = { typeDefs, resolvers };
