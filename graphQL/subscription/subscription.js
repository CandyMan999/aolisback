const { PubSub } = require("apollo-server");

const pubsub = new PubSub();

const CREATE_COMMENT = "CREATE_COMMENT";
const ROOM_CREATED_OR_UPDATED = "ROOM_CREATED_OR_UPDATED";
const CREATE_VIDEO = "CREATE_VIDEO";
const VIDEO_CHAT_REQUEST = "VIDEO_CHAT_REQUEST";
const CHANGE_PLAN = "CHANGE_PLAN";
const BUY_LIKES = "BUY_LIKES";
const BUY_MESSAGES = "BUY_MESSAGES";
const BUY_MINUTES = "BUY_MINUTES";
const FLAG_USER = "FLAG_USER";
const USER_MATCHED = "USER_MATCHED";

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

const changePlanSubscription = {
  subscribe: () => pubsub.asyncIterator(CHANGE_PLAN),
};
const buyLikesSubscription = {
  subscribe: () => pubsub.asyncIterator(BUY_LIKES),
};
const buyMessagesSubscription = {
  subscribe: () => pubsub.asyncIterator(BUY_MESSAGES),
};
const buyMinutesSubscription = {
  subscribe: () => pubsub.asyncIterator(BUY_MINUTES),
};

const flagUserSubscription = {
  subscribe: () => pubsub.asyncIterator(FLAG_USER),
};

const userMatchedSubscription = {
  subscribe: () => pubsub.asyncIterator(USER_MATCHED),
};

const publishMatchedUser = (request) => {
  pubsub.publish(USER_MATCHED, {
    userMatched: request,
  });
};

const publishFlagUser = (request) => {
  pubsub.publish(FLAG_USER, {
    flagUser: request,
  });
};

const publishBuyLikes = (request) => {
  pubsub.publish(BUY_LIKES, {
    buyLikes: request,
  });
};

const publishBuyMessages = (request) => {
  pubsub.publish(BUY_MESSAGES, {
    buyMessages: request,
  });
};

const publishBuyMinutes = (request) => {
  pubsub.publish(BUY_MINUTES, {
    buyVideoMinutes: request,
  });
};

const publishChangePlan = (request) => {
  pubsub.publish(CHANGE_PLAN, {
    changePlan: request,
  });
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
  changePlanSubscription,
  buyLikesSubscription,
  buyMessagesSubscription,
  buyMinutesSubscription,
  flagUserSubscription,
  userMatchedSubscription,
  publishCreateComment,
  publishRoomCreatedOrUpdated,
  publishCreateVideo,
  publishVideoChatRequest,
  publishChangePlan,
  publishBuyLikes,
  publishBuyMessages,
  publishBuyMinutes,
  publishFlagUser,
  publishMatchedUser,
};
