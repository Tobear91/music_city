const RefreshToken = require("../models/refreshTokens");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;

const generateAccessToken = (email) => {
  return jwt.sign({ email }, JWT_PRIVATE_KEY, { expiresIn: "1second" });
};

const generateRefreshToken = (email) => {
  return jwt.sign({ email }, JWT_REFRESH_KEY, { expiresIn: "1day" });
};

const saveRefreshToken = async (refresh_token, type, email) => {
  await RefreshToken.deleteOne({ type, email });
  await RefreshToken.create({ refresh_token, type, email, expiredAt: moment().add(1, "day").toDate() });
};

module.exports = { generateAccessToken, generateRefreshToken, saveRefreshToken };
