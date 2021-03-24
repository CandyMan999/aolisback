export default function reducer(state, { type, payload }) {
  switch (type) {
    case "LOGIN_USER":
      return {
        ...state,
        currentUser: payload,
      };
    case "TOGGLE_PROFILE":
      return {
        ...state,
        isProfile: payload,
      };
    case "TOGGLE_LOGIN":
      return {
        ...state,
        isLogin: payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        currentUser: payload,
      };
    case "JOIN_CHANNEL":
      return {
        ...state,
        userChannel: payload,
      };
    case "CHANGE_ROOM":
      return {
        ...state,
        roomId: payload,
      };
    case "VIEW_LOCATION":
      return {
        ...state,
        userLocationId: payload,
      };

    default:
      return state;
  }
}
