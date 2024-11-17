import { createContext } from "react";

const Context = createContext({
  currentUser: {
    username: null,
  },
  showTerms: false,
  profile: {},
  roomId: null,
  rooms: ["Main"],
  isProfile: false,
  showLogin: false,
  reply: { commentId: null, text: null, authorName: null },
  showSignup: false,
  showNavScreen: true,
  showVideo: false,
  showRoomList: false,
  showChatRequest: false,
  userChannel: null,
  videoChatRequest: {},
  userLocation: {
    _id: null,
    lat: null,
    lng: null,
  },
});

export default Context;
