const { changeRoomResolver } = require("./changeRoom");
const { logoutResolver } = require("./logout");
const {
  googleSignupResolver,
  googleLoginResolver,
  googleAppLoginResolver,
  googleAppSignupResolver,
} = require("./google");
const { signupResolver, appleSignupResolver } = require("./signUp");
const { loginResolver, appleLoginResolver } = require("./login");
const { createCommentResolver } = require("./comment");
const { createProfileResolver } = require("./createProfile");
const { updateLocationResolver } = require("./updateLocation");
const { addPhotoResolver } = require("./addPhoto");
const { sendVideoResolver } = require("./sendVideo");
const { createRoomResolver } = require("./createRoom");
const { deletePhotoResolver } = require("./deletePhoto");
const { videoChatRequestResolver } = require("./videoChatRequest");
const { updateVideoChatRequestResolver } = require("./updateVideoChatRequest");
const { blockResolver, unBlockResolver } = require("./block");
const { flagVideoResolver } = require("./flagVideo");
const { deleteVideoResolver } = require("./deleteVideo");
const { lookingForResolver } = require("./lookingFor");
const { viewVideoResolver } = require("./videoView");
const { getExpoTokenResolver } = require("./pushNotifications");
const { deleteAccountResolver } = require("./deleteAccount");
const { termsAgreementResolver } = require("./termsAgreement");
const { addPhoneResolver } = require("./addPhone");

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
  getExpoTokenResolver,
  appleSignupResolver,
  appleLoginResolver,
  deleteAccountResolver,
  termsAgreementResolver,
  addPhoneResolver,
};
