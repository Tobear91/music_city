const { generateAccessToken, generateRefreshToken, saveRefreshToken } = require("../modules/auth");
const { generateUserToken, getUser } = require("../modules/spotify");
const querystring = require("querystring");
const User = require("../models/users");
const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const router = express.Router();

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
    let datas = await generateUserToken(code);
    const { access_token: spotify_access_token, refresh_token: spotify_refresh_token } = datas;
    const spotify_user = await getUser(spotify_access_token);
    const { email, product } = spotify_user;

    // Creation de l'utilisateur ... ou pas
    let user = await User.findOne({ email });

    if (!user) {
      // Add user in database
      user = await User.create({
        email,
        password: bcrypt.hashSync(email, 10),
      });
    }

    // Generate tokens
    const app_access_token = generateAccessToken(user.email);
    const app_refresh_token = generateRefreshToken(user.email);
    saveRefreshToken(app_refresh_token, "app", email);
    saveRefreshToken(spotify_refresh_token, "spotify", email);

    const newUser = {
      email,
      access_token: app_access_token,
      spotify: {
        type: product,
        access_token: spotify_access_token,
      },
    };

    res.json({ result: true, user: newUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
