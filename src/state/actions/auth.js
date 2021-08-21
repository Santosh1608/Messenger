import axios from "axios";
export const login = (loginData) => async (dispatch) => {
  try {
    console.log(loginData);
    const res = await axios.post("http://localhost:8000/api/login", loginData);
    dispatch({ type: "LOGIN", payload: res.data });
  } catch (error) {
    console.log(error);
  }
};
export const signup = (signUpData) => async (dispatch) => {
  try {
    console.log(signUpData);
    const res = await axios.post(
      "http://localhost:8000/api/signup",
      signUpData
    );
    dispatch({ type: "SIGNUP", payload: res.data });
  } catch (error) {
    console.log(error);
  }
};
