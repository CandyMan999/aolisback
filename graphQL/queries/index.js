const { fetchMeResolver } = require("./fetchMe");
const { getRoomsResolver } = require("./getRooms");
const { getCommentsResolver } = require("./getComments");
const { findUserResolver } = require("./findUser");
const { getUsersMapResolver } = require("./getUsersMap");
const { getAllUsersResolver } = require("./getAllUsers");
const { getVideosResolver } = require("./getVideos");

module.exports = {
  fetchMeResolver,
  getRoomsResolver,
  getCommentsResolver,
  findUserResolver,
  getUsersMapResolver,
  getAllUsersResolver,
  getVideosResolver,
};
