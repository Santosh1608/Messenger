import classes from "./Card.module.css";
import React from "react";
import { useHistory } from "react-router-dom";
function Card({ user }) {
  console.log(user);
  const history = useHistory();
  return (
    <div
      onClick={() => history.push(`/user/${user._id}`)}
      className={classes.Card}
    >
      {user.name}
    </div>
  );
}

export default Card;
