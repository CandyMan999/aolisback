const { PubSub } = require("apollo-server");

const pubsub = new PubSub();

const CREATE_COMMENT = "CREATE_COMMENT";
const ROOM_CREATED_OR_UPDATED = "ROOM_CREATED_OR_UPDATED";
const CREATE_VIDEO = "CREATE_VIDEO";
const VIDEO_CHAT_REQUEST = "VIDEO_CHAT_REQUEST";

const roomCreatedOrUpdatedSubscription = {
  subscribe: () => pubsub.asyncIterator(ROOM_CREATED_OR_UPDATED),
};

const createCommentSubscription = {
  subscribe: () => pubsub.asyncIterator(CREATE_COMMENT),
};
const createVideoSubscription = {
  subscribe: () => pubsub.asyncIterator(CREATE_VIDEO),
};

const videoChatRequestSubscription = {
  subscribe: () => pubsub.asyncIterator(VIDEO_CHAT_REQUEST),
};
const publishVideoChatRequest = (request) => {
  pubsub.publish(VIDEO_CHAT_REQUEST, {
    videoChatRequest: request,
  });
};

const publishCreateComment = (newComment) => {
  pubsub.publish(CREATE_COMMENT, {
    createComment: newComment,
  });
};

const publishRoomCreatedOrUpdated = (room) => {
  pubsub.publish(ROOM_CREATED_OR_UPDATED, {
    roomCreatedOrUpdated: room,
  });
};

const publishCreateVideo = (video) => {
  pubsub.publish(CREATE_VIDEO, {
    createVideo: video,
  });
};

module.exports = {
  roomCreatedOrUpdatedSubscription,
  createCommentSubscription,
  createVideoSubscription,
  videoChatRequestSubscription,
  publishCreateComment,
  publishRoomCreatedOrUpdated,
  publishCreateVideo,
  publishVideoChatRequest,
};
