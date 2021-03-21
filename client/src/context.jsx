import { createContext } from "react";

const Context = createContext({
  currentUser: null,
  roomId: null,
  rooms: ["Main"],
  isProfile: false,
  isLogin: false,
  userChannel: null,
});

export default Context;
