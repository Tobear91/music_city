const mongoose = require("mongoose");

const releaseSchema = mongoose.Schema({
  release_id: Number,
  title: String,
  artist: String,
  thumb: String,
});

const userSchema = mongoose.Schema(
  {
    pseudo: String,
    email: String,
    password: String,
    avatar: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "tracks" }],
    avisInterpretations: [{ type: mongoose.Schema.Types.ObjectId, ref: "tracks" }],
    wantlist: [releaseSchema],
    collection: [releaseSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
