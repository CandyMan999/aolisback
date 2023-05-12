import { createContext } from "react";

const Context = createContext({
  currentUser: {
    username: null,
  },
  profile: {},
  roomId: null,
  rooms: ["Main"],
  isProfile: false,
  showLogin: false,
  showSignup: false,
  showVideo: false,
  userChannel: null,
  userLocation: {
    _id: null,
    lat: null,
    lng: null,
  },
});

export default Context;
