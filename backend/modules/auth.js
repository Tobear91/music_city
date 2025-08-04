const jwt = require("jsonwebtoken");

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;

const generateAccessToken = (email) => {
  return jwt.sign({ email }, JWT_PRIVATE_KEY, { expiresIn: "1second" });
};

const generateRefreshToken = (email) => {
  return jwt.sign({ email }, JWT_REFRESH_KEY, { expiresIn: "1day" });
};

module.exports = { generateAccessToken, generateRefreshToken };
