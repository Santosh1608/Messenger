const router = require("express").Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      throw new Error();
    }
    //compare passwords
    const isAuthenticated = await user.comparePasswords(req.body.password);
    if (!isAuthenticated) {
      throw new Error();
    }
    if (isAuthenticated) {
      //create token
      const token = user.createToken();
      user.password = undefined;
      res.send({ user, token });
    }
  } catch (error) {
    res.status(400).send({
      error: "Incorrect Credentials",
    });
  }
});

router.post(
  "/signup",
  [body("email", "enter correct email").isEmail()],
  async (req, res) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).send({
          error: errors.array()[0].msg,
        });
      }
      const user = new User(req.body);
      await user.save();
      await user.initializeSchemas();
      const token = user.createToken();
      user.password = undefined;
      res.send({ user, token });
    } catch (e) {
      if (e.code == 11000 && e.name == "MongoError") {
        return res.status(400).send({
          error: "Email is already exists",
        });
      }
      res.status(400).send({
        error: "Can't signup please try again later",
      });
    }
  }
);

module.exports = router;
