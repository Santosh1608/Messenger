import React, { useState } from "react";
import classes from "../Form.module.css";
import { Link } from "react-router-dom";
import { signup } from "../../../state/actions/auth";
import { useDispatch } from "react-redux";

function SignUp() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className={classes.FormWrap}>
        <form
          className={classes.Form}
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(signup({ name, email, password }));
          }}
        >
          <h1> 𝕤ί𝕘ⓝ𝕦ｐ👤</h1>
          <div>
            <input
              type="text"
              placeholder="Username"
              name="name"
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
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
            <button>SignUp</button>
          </div>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default SignUp;
