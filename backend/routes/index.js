const authenticateToken = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.get("/protected", authenticateToken, (_, res) => {
  res.json({ result: true });
});

module.exports = router;
