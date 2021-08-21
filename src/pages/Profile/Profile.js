import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_user } from "../../state/actions/user";
import classes from "./Profile.module.css";
function Profile() {
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.userReducer);
  const { user } = useSelector((state) => state.authReducer);
  const { id } = useParams();
  useEffect(() => {
    dispatch(get_user(id));
  }, []);
  console.log(userReducer, user);
  let isfriend = userReducer.user?.friends.includes(user._id);
  console.log(isfriend);

  return (
    <div className={classes.Profile}>
      <p>NAME: {userReducer.user?.user.name}</p>
      <p>EMAIL: {userReducer.user?.user.email}</p>
      <div className={classes.buttons}>
        <button disabled={!isfriend}>Message</button>
        <button>{isfriend ? "Friends" : "Follow"}</button>
      </div>
    </div>
  );
}

export default Profile;
