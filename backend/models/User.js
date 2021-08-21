const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Follow = require("./Follow");
const Notification = require("./Notification");
const Chat = require("./Chat");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// mogoose plugin
userSchema.plugin(mongoosePaginate);
// mongoose methods

// compare passwords
userSchema.methods.comparePasswords = async function (password) {
  const isAuthenticated = await bcrypt.compare(password, this.password);
  return isAuthenticated;
};

// initialize other schemas
userSchema.methods.initializeSchemas = async function () {
  await new Follow({
    user: this._id,
    friends: [],
    pending: [],
    requests: [],
  }).save();
  await new Notification({ user: this._id, notifications: [] }).save();
  await new Chat({ user: this._id }).save();
};
// compare token
userSchema.methods.createToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET);
  return token;
};

// encrypt password
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  } catch {
    throw new Error("something wrong with password please try again");
  }
});
module.exports = mongoose.model("User", userSchema);
