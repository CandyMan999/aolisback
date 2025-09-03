export default function reducer(state, { type, payload }) {
  switch (type) {
    case "LOGIN_USER":
      return {
        ...state,
        currentUser: payload,
      };
    case "SET_USER_COORDS":
      return {
        ...state,
        currentUser: { ...state.currentUser, location: payload },
      };
    case "TOGGLE_PROFILE":
      return {
        ...state,
        isProfile: payload,
      };
    case "CLOSE_NAV_SCREEN":
      return {
        ...state,
        showNavScreen: payload,
      };
    case "TOGGLE_LOGIN":
      return {
        ...state,
        showLogin: payload,
      };
    case "TOGGLE_SIGNUP":
      return {
        ...state,
        showSignup: payload,
      };
    case "TOGGLE_VIDEO":
      return {
        ...state,
        showVideo: payload,
      };
    case "TOGGLE_CHAT":
      return {
        ...state,
        showChatRequest: payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        currentUser: payload,
      };
    case "UPDATE_USER_PHOTOS":
      return {
        ...state,
        currentUser: { ...state.currentUser, pictures: payload },
      };
    case "UPDATE_USER_SINGLE_TIME":
      return {
        ...state,
        currentUser: { ...state.currentUser, singleTime: payload },
      };
    case "UPDATE_USER_DETAILS":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          intro: payload.intro,
          sex: payload.sex,
          age: payload.age,
          occupation: payload.occupation,
          drink: payload.drink,
          smoke: payload.smoke,
          marijuana: payload.marijuana,
          drugs: payload.drugs,
          kids: payload.kids,
        },
      };
    case "UPDATE_USER_PLAN":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          plan: payload,
        },
      };
    case "UPDATE_USER_TERMS":
      return {
        ...state,
        currentUser: { ...state.currentUser, terms: payload },
      };
    case "UPDATE_VIDEOS":
      return {
        ...state,
        currentUser: { ...state.currentUser, payload },
      };
    case "UPDATE_BLOCKED":
      return {
        ...state,
        currentUser: { ...state.currentUser, blockedUsers: payload },
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: payload,
      };
    case "UPDATE_LOOKING_FOR":
      return {
        ...state,
        currentUser: { ...state.currentUser, lookingFor: payload },
      };

    case "UPDATE_LOCATION":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          location: payload,
        },
      };
    case "UPDATE_USER_VIDEO":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          sentVideos: state.currentUser.sentVideos
            ? [...state.currentUser.sentVideos, payload]
            : [payload],
          plan: {
            ...state.currentUser.plan,
            messagesSent: payload.sender.plan.messagesSent,
            additionalMessages: payload.sender.plan.additionalMessages,
          },
        },
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
    case "CHANGE_VIEW_MODE":
      return {
        ...state,
        viewMode: payload,
      };
    case "SHOW_TERMS":
      return {
        ...state,
        showTerms: payload,
      };
    case "VIEW_LOCATION":
      return {
        ...state,
        userLocation: {
          _id: payload._id,
          lat: payload.lat,
          lng: payload.lng,
        },
      };

    case "CREATE_ROOM":
      return {
        ...state,
        showRoomList: payload,
      };

    case "SET_REPLY":
      return {
        ...state,
        reply: {
          commentId: payload.commentId,
          text: payload.text,
          authorName: payload.authorName,
        },
      };
    case "UPDATE_VIDEO_CHAT_REQUEST":
      return {
        ...state,
        videoChatRequest: payload,
      };
    case "UPDATE_LIKED_USERS":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          plan: payload.plan,
        },
      };

    default:
      return state;
  }
}
