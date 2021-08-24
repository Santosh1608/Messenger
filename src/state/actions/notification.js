import axios from "axios";
export const get_notifications = (limit) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/notifications?limit=${limit}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    if (limit)
      dispatch({ type: "GET_LIMITED_NOTIFICATIONS", payload: res.data });
    else {
      dispatch({ type: "GET_NOTIFICATIONS", payload: res.data });
    }
  } catch (error) {
    console.log(error);
  }
};

export const get_unseen_notifications_count = () => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/notifications/unseen`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    console.log("UNSEEN", res.data);
    dispatch({ type: "GET_UNSEEN_COUNT", payload: res.data });
  } catch (error) {
    console.log(error);
  }
};
