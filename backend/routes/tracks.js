var express = require("express");
var router = express.Router();
const scraperLyrics = require("../modules/MusicLab/getlyricsgetlyrics");

const Track = require("../models/tracks");

router.post("/", (req, res) => {   
  const newTrack = new Track({
    title: req.body.title,
    artist: req.body.artist,
    track_spotify_id: req.body.track_id,
    spotify_uri: req.body.uri,
    previewUrl: req.body.preview_uri,
    genres: req.body.genres,
  });
  newTrack.save(() => res.json({ result: true })); //à ameliorer
});

//scrap des lyrics (coté backend car doit recreer un DOM coté serveur)
router.get("/lyrics", async (req, res) => {
  const { artiste, titre } = req.query;

  if (!artiste || !titre) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  try {
    const lyrics = await scraperLyrics(artiste, titre);
    res.json({ lyrics });
  } catch (err) {
    res.status(500).json({ error: "Paramètres du GETLyrics invalides" });
  }
});

module.exports = router;
