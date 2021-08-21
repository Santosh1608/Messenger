import classes from "./Cards.module.css";
import React from "react";
import { useSelector } from "react-redux";
import Card from "./Card/Card";
function Cards() {
  const userReducer = useSelector((state) => state.userReducer);
  return (
    <div className={classes.Cards}>
      {userReducer.users.map((user) => {
        return <Card key={user._id} user={user} />;
      })}
    </div>
  );
}

export default Cards;
