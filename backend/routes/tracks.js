var express = require("express");
var router = express.Router();
const scraperLyrics = require("../modules/MusicLab/getlyrics");

const Track = require("../models/tracks");
const interpreterParoles = require("../modules/MusicLab/lyricsinterpretation");

//ajout d'un nouveau track
router.post("/", async (req, res) => {
  // console.log("Ajout d'un nouveau track :", req.body);
  try {
    // const date = new Date();
    // console.log(date);

    const track = await Track.findOne({ track_spotify_id: req.body.track_id });
    
    if (track) {
      return res.json({ result: false, error: "Track already exists" });
    }

    const newTrack = new Track({
      title: req.body.title,
      artist: req.body.artist,
      track_spotify_id: req.body.track_id,
      spotify_uri: req.body.uri,
      previewUrl: req.body.preview_uri,
      genres: req.body.genres,
      lyrics: req.body.lyrics.lyrics,
      album: req.body.album.name,
      album_tracks_id: req.body.album.tracks,
      release_date: req.body.release_date,
      likes_interpretation: 0,
      dislikes_interpretation: 0,
    });

    await newTrack.save();
    res.json({ result: true });
  } catch (err) {
    console.error("Erreur lors de l'ajout du track :", err);
    res.status(500).json({ error: err.message });
  }
});


//ajout/update des resultats d'une analyse de track
router.put("/updateanalyse", (req, res) => {
  const { track_id, interpretation, thematiques } = req.body;
  console.log(req.body.track_id);

  Track.findOneAndUpdate(
    { track_spotify_id: req.body.track_id },
    {
      interpretation: interpretation,
      thematiques: thematiques,
    }
  )
    .then(() => {
      res.json({ result: true });
    })
    .catch((err) => {
      res.status(500).json({ error: "Erreur lors de la mise à jour" });
    });
});

router.get("/like", async (req, res) => {
  const { track_id } = req.query;
  if (!track_id) {
    return res.status(400).json({ error: "Track ID manquant" });
  }
  Track.findOne({ track_spotify_id: track_id })
    .then((track) => {
      res.json({
        likes: track.likes_interpretation,
        dislikes: track.dislikes_interpretation,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des likes" });
    });
});

router.put("/like", async (req, res) => {});

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

//interprétation des paroles
//à faire avec un modèle de langage
router.get("/lyrics/interpretation", async (req, res) => {
  const { paroles, artiste } = req.query;

  if (!paroles) {
    return res.status(400).json({ error: "Lyrics manquants" });
  }

  try {
    const interpretation = await interpreterParoles(paroles, artiste);
    res.json({ interpretation });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Paramètres du GETlyricsinterpretation invalides" });
  }
});

module.exports = router;
