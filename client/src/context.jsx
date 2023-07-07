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
  showSignup: false,
  showVideo: false,
  showChatRequest: false,
  userChannel: null,
  userLocation: {
    _id: null,
    lat: null,
    lng: null,
  },
});

export default Context;
