const express = require("express");
const router = express.Router();

const spotifyPreviewFinder = require("spotify-preview-finder");
const { getRandomSeries } = require("../modules/tmdb");

const Show = require("../models/blindtests/shows");
const BlindTest = require("../models/blindtests/blindtests");
const User = require("../models/users");

// Route permettant de récupérer 10 séries aléatoires
router.get("/randomshow", async (req, res) => {
  try {
    // on attend que les 10 éries soient récupérées.
    const results = await Promise.all(
      Array.from({ length: 10 }, () => getRandomSeries())
    );
    //si certaines séries ont mal été récupéré on les supprime
    const series = results.filter((s) => s !== null);
    res.json({ series });
  } catch (error) {
    console.error("Erreur /randomshow:", error);
    res.status(500).json({ error: "Impossible de récupérer les séries" });
  }
});

//on récupère une preview avec le nom de la musque et de l'artiste
router.post("/previewUrl", async (req, res) => {
  try {
    const artistName = req.body.artistName;
    const trackName = req.body.trackName;

    const result = await spotifyPreviewFinder(trackName, artistName, 1);

    if (
      !result ||
      !result.results ||
      !result.results[0] ||
      !result.results[0].previewUrls ||
      result.results[0].previewUrls.length === 0
    ) {
      return res.json({ result: false, previewUrl: null });
    }
    res.json({ result: true, previewUrl: result.results[0].previewUrls[0] });
  } catch (error) {
    res.status(500).json({ result: false, error: "servor error" });
  }
});

// route permettant de récupérer tous les hsow pour vérifier
router.get("/allshows", async (req, res) => {
  try {
    const showData = await Show.find({});
    res.json({ result: true, allShow: showData });
  } catch (error) {
    console.error("Can't get shows :", error);
    res.status(500).json({ result: false, error: "Can't get shows" });
  }
});

// route permettant de récupérer tous les blindtest pour vérifier
router.get("/all", async (req, res) => {
  try {
    const blindtestData = await BlindTest.find({});
    res.json({ result: true, allblindtest: blindtestData });
  } catch (error) {
    console.error("Can't get blindtest :", error);
    res.status(500).json({ result: false, error: "Can't get blindtest" });
  }
});

// ajoute un show à la bdd
router.post("/newshow", async (req, res) => {
  const tmbdId = req.body.tmbdId;

  const isShowSaved = await Show.findOne({ tmbdId: tmbdId });
  if (isShowSaved === null) {
    const newShow = new Show({
      type: req.body.type,
      tmbdId,
      name: req.body.name,
      posterPath: req.body.posterPath,
      mainActor: req.body.mainActor,
      platform: req.body.platform,
      soundtrackName: req.body.soundtrackName,
      soundtrackArtist: req.body.soundtrackArtist,
      soundtrackPreview: req.body.soundtrackPreview,
      soundtrackSpotifyId: req.body.soundtrackSpotifyId,
      isPreviewCertain: req.body.isPreviewCertain,
    });

    const showSaved = await newShow.save();
    res.json({ result: true, show: showSaved });
  } else {
    // show already exists in database
    res.json({ result: false, error: "show already saved" });
  }
});

// Ajoute le blindtest fini a la base de données
router.post("/", async (req, res) => {
  try {
    const { email, Score, Type, questions } = req.body;
    const user = await User.findOne({ email: email });

    const questionDocs = [];
    for (const q of questions) {
      const show = await Show.findOne({ tmbdId: Number(q.showid) });

      questionDocs.push({
        show: show._id,
        userAnswer: q.userAnswer || "",
        actorRevealed: q.actorRevealed,
        posterRevealed: q.posterRevealed,
        isCorrect: q.isCorrect,
      });
    }
    const newBlindtest = new BlindTest({
      user: user._id,
      Score: Number(Score),
      Type,
      question: questionDocs,
    });

    const savedBlindtest = await newBlindtest.save();
    res.json(savedBlindtest);
  } catch (error) {
    console.error("Can't cretae document", error);
    res.status(500).json({ error: "Impossible to create blindtest" });
  }
});

module.exports = router;
