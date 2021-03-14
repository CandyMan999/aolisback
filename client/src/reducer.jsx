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

    default:
      return state;
  }
}
