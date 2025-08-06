const mongoose = require("mongoose");

const discogsAuthSchema = mongoose.Schema(
  {
    email: String,
    discogs_auth: Object,
  },
  { timestamps: true }
);

const discogsAuth = mongoose.model("discogs_auth", discogsAuthSchema);

module.exports = discogsAuth;
