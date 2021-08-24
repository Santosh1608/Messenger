const initialState = {
  notifications: [],
  limitedNotifications: [],
  unseen: 0,
};
const notificationReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_NOTIFICATIONS":
      return {
        ...state,
        notifications: payload.notifications,
        unseen: payload.unseen,
      };
    case "GET_LIMITED_NOTIFICATIONS":
      console.log(payload, "GET_LIMITED_NOTIFICATIONS");
      return {
        ...state,
        limitedNotifications: payload.notifications,
        unseen: payload.unseen,
      };
    case "GET_UNSEEN_COUNT":
      return {
        ...state,
        unseen: payload.unseen,
      };
    default:
      return state;
  }
};

export default notificationReducer;
