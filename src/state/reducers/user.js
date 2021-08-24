const initialState = {
  users: [],
  pages: 1,
  user: null,
};
const userReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_USERS":
      return {
        ...state,
        users: payload.docs,
        pages: payload.pages,
      };

    case "GET_USER":
      return {
        ...state,
        users: [],
        pages: 1,
        user: payload,
      };
    case "MODIFY_USER_REQUESTS": {
      const user = { ...state.user };
      console.log(user.requests, payload);
      const requests = [...user.requests];
      requests.push(payload);
      user.requests = requests;
      console.log(user.requests, requests);
      return {
        ...state,
        user,
      };
    }

    case "MODIFY_USER_PENDING": {
      const user = { ...state.user };
      console.log(user.pending, payload);
      const pending = [...user.pending];
      user.pending = pending.filter((pendingId) => pendingId != payload);
      return {
        ...state,
        user,
      };
    }
    case "MODIFY_USER_FRIENDS": {
      const user = { ...state.user };
      console.log(user.pending, payload);
      const pending = [...user.pending];
      const friends = [...user.friends];
      user.pending = pending.filter((pendingId) => pendingId != payload);
      friends.push(payload);
      user.friends = friends;
      return {
        ...state,
        user,
      };
    }
    case "CLEAR_USERS":
      return {
        ...state,
        users: [],
        pages: 1,
      };
    default:
      return state;
  }
};

export default userReducer;
