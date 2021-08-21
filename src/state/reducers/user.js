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
