const mongoose = require("mongoose");

const wantitemSchema = mongoose.Schema({
  release_id: Number,
  title: String,
  artist: String,
  thumb: String,
  uri: String,
});

const userSchema = mongoose.Schema(
  {
    pseudo: String,
    email: String,
    password: String,
    type: String,
    avatar: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "tracks" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "vinyles" }],
    avisInterpretations: [{ type: mongoose.Schema.Types.ObjectId, ref: "tracks" }],
    wantlist: [wantitemSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
