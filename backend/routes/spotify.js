const { checkBody } = require("../modules/helpers");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const querystring = require("querystring");
const { requestToken, generateClientCredentials } = require("../modules/spotify");

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "http://127.0.0.1:3000/spotify/callback";

router.get("/login", async (req, res, next) => {
  try {
    const generateRandomString = (length) => {
      return crypto.randomBytes(60).toString("hex").slice(0, length);
    };

    const state = generateRandomString(16);
    const scope = "user-read-private user-read-email";

    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: SPOTIFY_CLIENT_ID,
          scope: scope,
          redirect_uri: REDIRECT_URI,
          state: state,
        })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/callback", async (req, res, next) => {
  try {
    if (req.query.error) throw Object.assign(new Error("Access Denied"), { status: 403 });
    const { code } = req.query;
    const body = new URLSearchParams();
    body.append("code", code);
    body.append("redirect_uri", REDIRECT_URI);
    body.append("grant_type", "authorization_code");

    // const datas = await requestToken(body);
    const datas = await generateClientCredentials();
    console.log(datas);

    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
