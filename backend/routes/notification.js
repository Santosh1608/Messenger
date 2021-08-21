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
    console.log("Notification", UserNotification);
    res.send({ notifications: UserNotification.notifications });

    let seenNotifications = UserNotification.notifications.map(
      (notification) => {
        return notification._id;
      }
    );
    const allNotifications = await Notification.findOne({
      user: req.user._id,
    });
    allNotifications.notifications.map((notification) => {
      if (
        seenNotifications.includes(notification._id) &&
        notification.seen !== true
      ) {
        notification.seen = true;
      }
      return notification;
    });
    console.log(allNotifications);
    allNotifications.save();
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "ERROR GETTING NOTIFICATIONS" });
  }
});

module.exports = router;
