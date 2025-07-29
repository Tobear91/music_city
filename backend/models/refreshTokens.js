const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    refresh_token: String,
    type: String,
    email: String,
    expiresAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("refresh_tokens", refreshTokenSchema);
