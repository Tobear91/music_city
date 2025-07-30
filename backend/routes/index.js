const authenticateToken = require("../middlewares/auth");
const RefreshToken = require("../models/refreshTokens");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;

router.post("/refresh-token", async (req, res, next) => {
  try {
    const cookies = req.cookies;
    console.log(cookies);
    // if (!token) return next(Object.assign(new Error("Access token not found"), { status: 404 }));

    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});

router.get("/protected", authenticateToken, (_, res) => {
  res.json({ result: true });
});

module.exports = router;
