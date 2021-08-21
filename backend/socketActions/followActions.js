const { request } = require("express");
const Follow = require("../models/Follow");
const Notification = require("../models/Notification");
const followRequest = async (followUserId, userId) => {
  console.log("request user");
  // CHECK IF ALREADY FRIENDS
  const user = await Follow.findOne({ user: userId });
  const friends = user.friends.filter(friend === followUserId);
  if (friends) {
    return {
      data: null,
      error: "Already u became friends",
    };
  }

  // CHECK IF ALREADY REQUEST SENT
  const pending = user.pending.filter(
    (pendingId) => pendingId === followUserId
  );
  if (pending) {
    return {
      data: null,
      error: "Already sent a follow request",
    };
  } else {
    // ADD FOLLOW USER TO PENDING ARRAY
    user.pending.push(followUserId);
    await user.save();

    // ADD FOLLOWING USER TO REQUESTS ARRAY
    const followUser = await Follow.findOne({ user: followUserId });
    followUser.requests.push(userId);
    await followUser.save();

    // SET NOTIFICATION TO FOLLOW USER
    const NotificationUser = await Notification.findOne({ user: followUserId });

    NotificationUser.notifications.push({
      type: "request",
      user: userId,
      requestStatus: "pending",
    });
    await NotificationUser.save();
    return {
      data: "Sent a follow request",
      error: null,
    };
  }
};

const acceptRequest = async (requestedUserId, userId) => {
  console.log("accept Request");
  // CHECK IF ALREADY FRIENDS
  const user = await Follow.findOne({ user: userId });
  const friends = user.friends.find(friend === followUserId);
  if (friends) {
    return {
      data: null,
      error: "Already u became friends",
    };
  }

  // CHECK IF REQUESTED USER IN REQUEST ARRAY
  const requested = user.requests.findIndex(
    (requestedId) => requestedId === requestedUserId
  );
  if (requested === -1) {
    return {
      data: null,
      error: "U can't accept not request people",
    };
  } else {
    // REMOVE REQUESTED USER FROM REQUESTS ARRAY
    user.requests.splice(requested, 1);

    // ADD REQUESTED USER TO FRIENDS LIST
    user.friends.push(requestedUserId);

    await user.save();
    // CHANGE REQUEST STATUS TO COMPLETED FOR USER NOTIFICATION
    const userNotification = await Notification.findOne({ user: userId });
    const notificationIndex = userNotification.notifications.findIndex(
      (notification) =>
        notification.user === requestedUserId &&
        type === "request" &&
        requestStatus === "pending"
    );
    if (notificationIndex !== -1) {
      userNotification.notifications[notificationIndex].requestStatus =
        "completed";
    }

    // SET NOTIFICATION FOR USER
    userNotification.notifications.push({
      type: "accept",
      user: requestedUserId,
    });
    await userNotification.save();

    // SET NOTIFICATION FOR REQUESTED USER
    const requestedUserNotification = await Notification.findOne({
      user: requestedUserId,
    });
    requestedUserNotification.notifications.push({
      type: "accepted",
      user: userId,
    });
    await requestedUserNotification.save();

    // REMOVE USER FROM PENDING ARRAY
    const requestedUser = await Follow.findOne({ user: requestedUserId });
    const pendingUserIndex = requestedUser.pending.findIndex(
      (pendingId) => pendingId === userId
    );
    if (pendingUserIndex !== -1) {
      requestedUser.pending.splice(pendingUserIndex, 1);
    }

    // ADD USER TO FRIENDS LIST
    requestedUser.friends.push(userId);

    await requestedUser.save();
    return {
      data: "request accepted",
      error: null,
    };
  }
};

const ignoreRequest = async (requestedUserId, userId) => {
  // CHECK IF PRIVIOUSLY NOT FRIENDS
  const user = await Follow.findOne({ user: userId });
  const friends = user.friends.find(friend === followUserId);
  if (!friends) {
    return {
      data: null,
      error: "You are not friends",
    };
  }

  // CHECK IF REQUESTED USER IN REQUEST ARRAY
  const requested = user.requests.findIndex(
    (requestedId) => requestedId === requestedUserId
  );
  if (requested === -1) {
    return {
      data: null,
      error: "U can't ignore not requested people",
    };
  } else {
    // REMOVE REQUESTED USER FROM REQUESTS ARRAY
    user.requests.splice(requested, 1);

    // CHANGE REQUEST STATUS TO COMPLETED FOR USER NOTIFICATION
    const userNotification = await Notification.findOne({ user: userId });
    const notificationIndex = userNotification.notifications.findIndex(
      (notification) =>
        notification.user === requestedUserId &&
        type === "request" &&
        requestStatus === "pending"
    );
    if (notificationIndex !== -1) {
      userNotification.notifications[notificationIndex].requestStatus =
        "completed";
    }
    await userNotification.save();

    // REMOVE USER FROM PENDING ARRAY
    const requestedUser = await Follow.findOne({ user: requestedUserId });
    const pendingUserIndex = requestedUser.pending.findIndex(
      (pendingId) => pendingId === userId
    );
    if (pendingUserIndex !== -1) {
      requestedUser.pending.splice(pendingUserIndex, 1);
    }
    await requestedUser.save();
    return {
      data: "request ignored",
      error: null,
    };
  }
};
module.exports = {
  followRequest,
  acceptRequest,
  ignoreRequest,
};
