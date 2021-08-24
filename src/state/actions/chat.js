import axios from "axios";
export const get_chat = () => async (dispatch) => {
  try {
    const res = await axios.get("http://localhost:8000/api/chat/loadChat", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    dispatch({ type: "GET_CHAT", payload: res.data });
  } catch (error) {
    console.log(error);
  }
};

export const get_messages = (receiverId, socket) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/chat/loadMessages/${receiverId}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    socket.emit("setSeen", receiverId);
    dispatch({ type: "GET_MESSAGES", payload: res.data });
  } catch (error) {
    console.log(error);
  }
};

export const set_seen = () => {
  return {
    type: "SET_SEEN",
  };
};
export const set_online = ({ users }) => {
  return {
    type: "SET_ONLINE",
    payload: users.map((user) => user.userId),
  };
};
export const remove_current_chat_id = () => {
  return {
    type: "REMOVE CURRENT_CHAT_ID",
  };
};
export const increase_unread_count = (from) => {
  return {
    type: "INCREASE_UNREAD_COUNT",
    payload: from,
  };
};
export const add_to_messages = (message) => {
  return {
    type: "ADD_TO_MESSAGES",
    payload: message,
  };
};
