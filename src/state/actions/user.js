import axios from "axios";
export const search = (name, page) => async (dispatch) => {
  try {
    if (name.length > 0) {
      const res = await axios.get(
        `http://localhost:8000/api/${name}?limit=3&page=${page}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      dispatch({ type: "GET_USERS", payload: res.data });
    } else {
      dispatch({ type: "CLEAR_USERS" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const get_user = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`http://localhost:8000/api/user/${userId}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    dispatch({ type: "GET_USER", payload: res.data });
  } catch (error) {
    console.log(error);
  }
};
