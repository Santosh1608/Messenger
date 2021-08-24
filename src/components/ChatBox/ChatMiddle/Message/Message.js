import classes from "./Message.module.css";
import React from "react";

function Message({ message, own, setRef }) {
  const styles = [classes.Message];
  if (own) {
    styles.push(classes.Own);
  }
  return (
    <div ref={setRef} className={styles.join(" ")}>
      {message.message}
      <br />
      <span>{message.seen ? "seen" : "not seen"}</span>
    </div>
  );
}

export default React.forwardRef(Message);
