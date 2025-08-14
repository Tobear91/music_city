const helpers = require("../modules/helpers");
const spotify = require("../modules/spotify");
const auth = require("../modules/auth");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

// Models
const User = require("../models/users");
const Track = require("../models/tracks");

// Inscription d'un user
router.post("/signup", async (req, res, next) => {
  try {
    // Check fields are missing
    if (!helpers.checkBody(req.body, ["pseudo", "email", "password"]))
      throw Object.assign(new Error("Missing or empty fields"), {
        status: 400,
      });
    const { email, password, pseudo } = req.body;

    // Check user in database
    let user = await User.findOne({ email });
    if (user) throw Object.assign(new Error("User already exist"), { status: 409 });

    // Add user in database
    user = await User.create({
      pseudo,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});

// Connexion d'un user
router.post("/login", async (req, res, next) => {
  try {
    // Check fields are missing
    if (!helpers.checkBody(req.body, ["email", "password"]))
      throw Object.assign(new Error("Missing or empty fields"), {
        status: 400,
      });
    const { email, password } = req.body;

    // Check user in database
    let user = await User.findOne({ email });
    if (!user || (user && !bcrypt.compareSync(password, user.password))) throw Object.assign(new Error("Unauthorized"), { status: 401 });

    // Generate tokens
    const access_token = auth.generateAccessToken(email);

    const datas = await spotify.generateSimpleToken();
    const { access_token: spotify_access_token } = datas;

    user = {
      email,
      access_token,
      spotify: {
        type: "simple",
        access_token: spotify_access_token,
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
      const spotifyIds = user.avisInterpretations.map((avis) => avis.track_spotify_id);
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
      await User.findOneAndUpdate({ email: email }, { $addToSet: { favorites: id } });
      console.log("id ajouté");
      return res.json({ result: true });
    } else {
      await User.findOneAndUpdate({ email: email }, { $pull: { favorites: id } });
      console.log("id supprimé");
      return res.json({ result: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false });
  }
});

//recupere les favoris de l'utilisateur
router.post("/favorites", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).populate("favorites");
  res.json({ result: true, favorites: user.favorites });
});

//suppression d'un favoris
router.post("/removefromfavorites", async (req, res) => {
  const { track_id, email } = req.body;

  const track = await Track.findOne({ track_spotify_id: track_id });

  await User.findOneAndUpdate({ email: email }, { $pull: { favorites: track._id } });

  res.json({ result: true });
});
module.exports = router;

// Récupération de la wantlist d'un user depuis la BDD Mongo
router.post("/wantlist", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }, { wantlist: 1, _id: 0 });
    res.json({ result: true, wantlist: user?.wantlist || [] });
  } catch (error) {
    next(error);
  }
});

// Ajout des releases depuis discogs vers la wantlist BDD Mongo (pour être toujours à jour entre l'API Discogs et la BDD Mongo)
router.post("/set-wantlist", async (req, res, next) => {
  try {
    const { email, releases } = req.body;
    await User.updateOne({ email }, { $set: { wantlist: [] } });

    releases.forEach(async (release) => {
      await User.findOneAndUpdate({ email }, { $push: { wantlist: release } }, { new: true });
    });

    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});

// Ajout ou suppression d'une release dans le sous document wantlist
router.put("/toggle-wantlist", async (req, res, next) => {
  try {
    const { action, email, release } = req.body;

    if (action === "add") {
      await User.findOneAndUpdate({ email }, { $push: { wantlist: release } }, { new: true });
    } else {
      await User.findOneAndUpdate({ email }, { $pull: { wantlist: { release_id: release.release_id } } }, { new: true });
    }

    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});

// Récupération de la collection d'un user depuis la BDD Mongo
router.post("/collection", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }, { collection: 1, _id: 0 });
    res.json({ result: true, collection: user?.collection || [] });
  } catch (error) {
    next(error);
  }
});

// Ajout des releases depuis discogs vers la collection BDD Mongo (pour être toujours à jour entre l'API Discogs et la BDD Mongo)
router.post("/set-collection", async (req, res, next) => {
  try {
    const { email, releases } = req.body;
    await User.updateOne({ email }, { $set: { collection: [] } });

    releases.forEach(async (release) => {
      await User.findOneAndUpdate({ email }, { $push: { collection: release } }, { new: true });
    });

    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});

// Ajout ou suppression d'une release dans le sous document collection
router.put("/toggle-collection", async (req, res, next) => {
  try {
    const { action, email, release } = req.body;

    if (action === "add") {
      await User.findOneAndUpdate({ email }, { $push: { collection: release } }, { new: true });
    } else {
      await User.findOneAndUpdate({ email }, { $pull: { collection: { release_id: release.release_id } } }, { new: true });
    }

    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});
