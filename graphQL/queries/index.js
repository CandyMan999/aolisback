const { fetchMeResolver } = require("./fetchMe");
const { getRoomsResolver } = require("./getRooms");
const { getCommentsResolver } = require("./getComments");
const { findUserResolver } = require("./findUser");
const { getUsersMapResolver } = require("./getUsersMap");
const { getAllUsersResolver } = require("./getAllUsers");
const { getVideosResolver } = require("./getVideos");
const { getLikedUsersResolver } = require("./getLikedUsers");
const { getUsersWhoLikedMeResolver } = require("./getUsersWhoLikedMe");
const { getMatchedUsersResolver } = require("./getMatches");
const {
  getFlaggedPicturesResolver,
  getFlaggedVideosResolver,
} = require("./getFlagged");

module.exports = {
  fetchMeResolver,
  getRoomsResolver,
  getCommentsResolver,
  findUserResolver,
  getUsersMapResolver,
  getAllUsersResolver,
  getVideosResolver,
  getLikedUsersResolver,
  getUsersWhoLikedMeResolver,
  getMatchedUsersResolver,
  getFlaggedPicturesResolver,
  getFlaggedVideosResolver,
};
