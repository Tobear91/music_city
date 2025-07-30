const helpers = require("../modules/helpers");
const spotify = require("../modules/spotify");
const auth = require("../modules/auth");
const bcrypt = require("bcryptjs");
const express = require("express");
const moment = require("moment");
const router = express.Router();

// Models
const User = require("../models/users");

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: xxx.xxx@xxx.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68812c3310dc82f9709ac23b
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: xxx.xxx@xxx.com
 *                     password:
 *                       type: string
 *                       example: ...
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-23T18:38:43.603Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-23T18:38:43.603Z
 *       400:
 *         description: Champs requis manquants
 *       409:
 *         description: Utilisateur déjà existant
 */
router.post("/signup", async (req, res, next) => {
  try {
    // Check fields are missing
    if (!helpers.checkBody(req.body, ["email", "password"])) throw Object.assign(new Error("Missing or empty fields"), { status: 400 });
    const { email, password } = req.body;

    // Check user in database
    let user = await User.findOne({ email });
    if (user) throw Object.assign(new Error("User already exist"), { status: 409 });

    // Add user in database
    user = await User.create({
      email,
      password: bcrypt.hashSync(password, 10),
      type: "app",
    });

    // Generate tokens
    const access_token = auth.generateAccessToken(user.email);
    const refresh_token = auth.generateRefreshToken(user.email);
    auth.saveRefreshToken(refresh_token, "app", email);

    // Generate cookies
    res.cookie("app_refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: moment().add(1, "day").toDate(),
    });

    user = {
      email,
      access_token,
      spotify: {
        type: "simple",
        access_token: await spotify.generateSimpleToken(),
      },
    };

    res.json({ result: true, user });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authentifie un utilisateur et retourne un token JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: xxx.xxx@xxx.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne l'utilisateur et un access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: xxx.xxx@xxx.com
 *                     access_token:
 *                       type: string
 *                       description: Token JWT d'accès
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Champs requis manquants
 *       401:
 *         description: Identifiants invalides
 */
router.post("/login", async (req, res, next) => {
  try {
    // Check fields are missing
    if (!helpers.checkBody(req.body, ["email", "password"])) throw Object.assign(new Error("Missing or empty fields"), { status: 400 });
    const { email, password } = req.body;

    // Check user in database
    let user = await User.findOne({ email, type: "app" });
    if (!user || (user && !bcrypt.compareSync(password, user.password))) throw Object.assign(new Error("Unauthorized"), { status: 401 });

    // Generate tokens
    const access_token = auth.generateAccessToken(email);
    const refresh_token = auth.generateRefreshToken(email);
    auth.saveRefreshToken(refresh_token, email);

    // Generate cookies
    res.cookie("app_refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: moment().add(1, "day").toDate(),
    });

    user = {
      email,
      access_token,
      spotify: {
        type: "simple",
        access_token: await spotify.generateSimpleToken(),
      },
    };

    res.json({ result: true, user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
