import { createContext } from "react";

const Context = createContext({
  currentUser: {
    username: null,
  },
  roomId: null,
  rooms: ["Main"],
  isProfile: false,
  showLogin: false,
  showSignup: false,
  userChannel: null,
  userLocation: {
    _id: null,
    lat: null,
    lng: null,
  },
});

export default Context;
