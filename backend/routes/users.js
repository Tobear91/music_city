const helpers = require("../modules/helpers");
const spotify = require("../modules/spotify");
const auth = require("../modules/auth");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

// Models
const User = require("../models/users");
const Track = require("../models/tracks");

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
    if (!helpers.checkBody(req.body, ["pseudo", "email", "password"]))
      throw Object.assign(new Error("Missing or empty fields"), {
        status: 400,
      });
    const { email, password, pseudo } = req.body;

    // Check user in database
    let user = await User.findOne({ email, type: "app" });
    if (user)
      throw Object.assign(new Error("User already exist"), { status: 409 });

    // Add user in database
    user = await User.create({
      pseudo,
      email,
      password: bcrypt.hashSync(password, 10),
      type: "app",
    });

    res.json({ result: true });
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
    if (!helpers.checkBody(req.body, ["email", "password"]))
      throw Object.assign(new Error("Missing or empty fields"), {
        status: 400,
      });
    const { email, password } = req.body;

    // Check user in database
    let user = await User.findOne({ email, type: "app" });
    if (!user || (user && !bcrypt.compareSync(password, user.password)))
      throw Object.assign(new Error("Unauthorized"), { status: 401 });

    // Generate tokens
    const access_token = auth.generateAccessToken(email);

    user = {
      email,
      access_token,
      spotify: {
        type: "simple",
        access_token: await spotify.generateSimpleToken(),
      },
      discogs: !!req.session.accessData,
    };

    res.json({ result: true, user });
  } catch (error) {
    next(error);
  }
});

//retourne la liste de votes coté front pour déterminer s'il faut afficher l'option
router.get("/avisInterpretations", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  User.findOne({ email: email })
    .populate("avisInterpretations")
    .then((user) => {
      const spotifyIds = user.avisInterpretations.map(
        (avis) => avis.track_spotify_id
      );
      res.json(spotifyIds);
    });
});

// ajout/retrait d'un object_id des favoris à partir d'un id spotify + email
router.post("/addtofavorites", async (req, res) => {
  const { email, track_id, uri, artist, title } = req.body;
  if (!email || !track_id) {
    return res.status(400).json({ error: "Email and Id are required" });
  }

  try {
    let track = await Track.findOne({ track_spotify_id: track_id });
    if (!track) {
      console.log(email);
      const newtrack = new Track({
        title: title,
        artist: artist,
        spotify_uri: uri,
        track_spotify_id: track_id,
      });
      track = await newtrack.save();
    }

    const doc = await User.findOne({ email: email });
    if (!doc) {
      return res.status(404).json({ error: "User not found" });
    }

    const id = track._id;

    if (!doc.favorites.includes(id)) {
      await User.findOneAndUpdate(
        { email: email },
        { $addToSet: { favorites: id } }
      );
      console.log("id ajouté");
      return res.json({ result: true });
    } else {
      await User.findOneAndUpdate(
        { email: email },
        { $pull: { favorites: id } }
      );
      console.log("id supprimé");
      return res.json({ result: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false });
  }
});

router.post("/favorites", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).populate("favorites");
  res.json({ result: true, favorites: user.favorites });
});

router.post("/removefromfavorites", async (req, res) => {
  const { track_id, email } = req.body;

  const track = await Track.findOne({ track_spotify_id: track_id });

  await User.findOneAndUpdate(
    { email: email },
    { $pull: { favorites: track._id } }
  );

  res.json({ result: true });
});
module.exports = router;
