import { createContext } from "react";

const Context = createContext({
  currentUser: null,
  roomId: null,
  rooms: ["Main"],
  isProfile: false,
  isLogin: false,
  userChannel: null,
  userLocation: {
    _id: null,
    lat: null,
    lng: null,
  },
});

export default Context;
