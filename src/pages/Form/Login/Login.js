import React, { useEffect, useState } from "react";
import classes from "../Form.module.css";
import { Link } from "react-router-dom";
import { login } from "../../../state/actions/auth";
import { useDispatch } from "react-redux";
function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className={classes.FormWrap}>
        <form
          className={classes.Form}
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(login({ email, password }));
          }}
        >
          <h1>Ĺ𝕆𝓖ιή 👤</h1>

          <div>
            <input
              type="text"
              placeholder="Email"
              name="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div>
            <button>LOGIN</button>
          </div>
          <p>
            Don't have account? <Link to="/signup">SignUp</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
