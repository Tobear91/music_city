const spotify = require("../modules/spotify");
const querystring = require("querystring");
const auth = require("../modules/auth");
const User = require("../models/users");
const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const moment = require("moment");
const router = express.Router();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

/**
 * @swagger
 * /spotify/login:
 *   get:
 *     summary: Redirige vers la page d'autorisation Spotify (OAuth2)
 *     tags: [Spotify]
 *     description: |
 *       Démarre le flux d'authentification OAuth2 avec Spotify. Redirige l'utilisateur vers Spotify pour qu'il autorise l'application.
 *     responses:
 *       302:
 *         description: Redirection vers Spotify pour authentification
 *       500:
 *         description: Erreur serveur lors de la génération de l'URL d'autorisation
 */
router.get("/login", async (req, res, next) => {
  try {
    const generateRandomString = (length) => {
      return crypto.randomBytes(60).toString("hex").slice(0, length);
    };

    const state = generateRandomString(16);
    const scope = "user-read-private user-read-email user-top-read user-follow-read user-library-read playlist-read-private";
    const redirect_url =
      "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        state: state,
      });

    res.json({ redirect_url });
  } catch (error) {
    next(error);
  }
});

router.get("/callback", async (req, res, next) => {
  try {
    if (req.query.error) throw Object.assign(new Error("Access Denied"), { status: 403 });
    const { code } = req.query;
    let datas = await spotify.generateUserToken(code);
    const { access_token: spotify_access_token, refresh_token: spotify_refresh_token } = datas;
    const spotify_user = await spotify.getUser(spotify_access_token);
    const { email, product } = spotify_user;

    // Creation de l'utilisateur ... ou pas
    let user = await User.findOne({ email, type: "spotify" });

    if (!user) {
      // Add user in database
      user = await User.create({
        email,
        password: bcrypt.hashSync(email, 10),
        type: "spotify",
      });
    }

    // Generate tokens
    const app_access_token = auth.generateAccessToken(user.email);

    // Generate le cookie du refresh token spotify
    res.cookie("spotify_refresh_token", spotify_refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: moment().add(1, "year").toDate(),
    });

    const newUser = {
      email,
      access_token: app_access_token,
      spotify: {
        type: product,
        access_token: spotify_access_token,
      },
      discogs: !!req.session.accessData,
    };

    const encoded = Buffer.from(JSON.stringify(newUser)).toString("base64");
    res.redirect(`http://127.0.0.1:3001/connexion?user=${encoded}`);
  } catch (error) {
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const refresh_token = req.cookies.spotify_refresh_token;
    if (!refresh_token) throw Object.assign(new Error("Refresh token not found"), { status: 404 });

    const { type } = req.body;
    let datas = {};

    if (type === "simple") {
      datas = await spotify.generateSimpleToken();
    } else {
      datas = await spotify.refreshUserToken(refresh_token);
    }

    const { access_token } = datas;
    res.json({ result: true, access_token });
  } catch (error) {
    res.json({ result: false, logout: true });
  }
});

module.exports = router;
