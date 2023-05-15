const { changeRoomResolver } = require("./changeRoom");
const { logoutResolver } = require("./logout");
const { googleSignupResolver, googleLoginResolver } = require("./google");
const { signupResolver } = require("./signUp");
const { loginResolver } = require("./login");
const { createCommentResolver } = require("./comment");
const { createProfileResolver } = require("./createProfile");
const { updateLocationResolver } = require("./updateLocation");
const { addPhotoResolver } = require("./addPhoto");
const { sendVideoResolver } = require("./sendVideo");
const { createRoomResolver } = require("./createRoom");
const { deletePhotoResolver } = require("./deletePhoto");

module.exports = {
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
};
