const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    type: String,
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
