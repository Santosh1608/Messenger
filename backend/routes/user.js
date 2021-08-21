const router = require("express").Router();
const User = require("../models/User");
const Follow = require("../models/Follow");
const { isSignedIn } = require("../middleware/auth");
router.get("/:name", isSignedIn, async (req, res) => {
  // find users
  console.log(req.user);
  try {
    const users = await User.paginate(
      {
        name: new RegExp("^" + req.params.name, "i"),
        _id: { $ne: req.user._id },
      },
      {
        page: parseInt(req.query.page),
        sort: { _id: -1 },
        limit: parseInt(req.query.limit),
      }
    );
    res.send(users);
  } catch (error) {
    res.status(400).send({
      error: "Error",
    });
  }
});

router.get("/user/:userId", isSignedIn, async (req, res) => {
  try {
    const user = await (await Follow.findOne({ user: req.params.userId }))
      .populate("user", "name email")
      .execPopulate();
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: "ERROR" });
  }
});
module.exports = router;
