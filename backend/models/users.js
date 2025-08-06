const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    pseudo: String,
    email: String,
    password: String,
    type: String,
    discogs_auth: Object,
    avatar: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "tracks" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "vinyles" }],
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
