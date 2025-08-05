const jwt = require("jsonwebtoken");

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

const generateAccessToken = (email) => {
  return jwt.sign({ email }, JWT_PRIVATE_KEY, { expiresIn: "7days" });
};

module.exports = { generateAccessToken };
