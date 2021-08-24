const router = require("express").Router();
const Notification = require("../models/Notification");
const { isSignedIn } = require("../middleware/auth");
router.get("/notifications", isSignedIn, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    console.log("LIMIT", limit);
    const UserNotification = limit
      ? await Notification.findOne(
          {
            user: req.user._id,
          },
          { notifications: { $slice: [0, limit] } }
        ).populate("notifications.user", "name")
      : await Notification.findOne({
          user: req.user._id,
        }).populate("notifications.user", "name");
    const AllNotifications = await Notification.findOne({
      user: req.user._id,
    });
    const unSeenNotifications = AllNotifications.notifications.filter(
      (notification) => notification.seen == false
    );
    res.send({
      notifications: UserNotification.notifications,
      unseen: unSeenNotifications.length,
    });

    let seenNotifications = UserNotification.notifications.map(
      (notification) => {
        return notification._id;
      }
    );
    const modifiedNotifications = AllNotifications.notifications.map(
      (notification) => {
        if (
          seenNotifications.includes(notification._id) &&
          notification.seen !== true
        ) {
          notification.seen = true;
        }
        return notification;
      }
    );
    AllNotifications.notifications = modifiedNotifications;
    AllNotifications.save();
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "ERROR GETTING NOTIFICATIONS" });
  }
});

router.get("/notifications/unseen", isSignedIn, async (req, res) => {
  try {
    const AllNotifications = await Notification.findOne({
      user: req.user._id,
    });
    const unSeenNotifications = AllNotifications.notifications.filter(
      (notification) => notification.seen == false
    );
    console.log(unSeenNotifications, "UNSEEN");
    res.send({
      unseen: unSeenNotifications.length,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
