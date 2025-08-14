var express = require("express");
var router = express.Router();
const scraperLyrics = require("../modules/MusicLab/getlyrics");

const User = require("../models/users");
const Track = require("../models/tracks");
const interpreterParoles = require("../modules/MusicLab/lyricsinterpretation");
const spotifyPreviewFinder = require("spotify-preview-finder");

//ajout d'un nouveau track à la database
router.post("/", async (req, res) => {
  try {
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
      album_name: req.body.album,
      album_tracks_id: req.body.album.tracks,
      album_image: req.body.album_image,
      release_date: req.body.release_date,
      likes_interpretation: 0,
      dislikes_interpretation: 0,
      duration_ms: req.body.duration_ms
    });
    await newTrack.save();
    res.json({ result: true });
  } catch (err) {
    console.error("Erreur lors de l'ajout du track :", err);
    res.status(500).json({ error: err.message });
  }
});

//recupere la track dans la db
router.get("/", async (req, res) => {
  const { track_id } = req.query;
  if (!track_id) {
    return res.status(400).json({ error: "Track ID manquant" });
  }
  try {
    const track = await Track.findOne({ track_spotify_id: track_id });
    if (!track) {
      return res.status(404).json({ error: "Track non trouvé" });
    }
    res.json({ track });
  } catch (err) {
    console.error("Erreur lors de la récupération du track :", err);
    res.status(500).json({ error: "Erreur lors de la récupération du track" });
  }
});

//ajout/update des resultats d'une analyse de track
router.put("/updateanalyse", (req, res) => {
  const { track_id, interpretation, thematiques } = req.body;
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

//pour avoir la liste des likes et dislikes de l'interpretation (optionnel car fonctionnalité de reset interpretation pas encore implementé)
router.get("/like", async (req, res) => {
  const { track_id } = req.query;
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

//like sur interpretation + update clés étrangères users
router.put("/like", async (req, res) => {
  const { track_id, email } = req.body;

  try {
    await Track.findOneAndUpdate(
      { track_spotify_id: track_id },
      { $inc: { likes_interpretation: 1 } }
    );

    const trackdocument = await Track.findOne({ track_spotify_id: track_id });
    await User.findOneAndUpdate(
      { email: email },
      { $addToSet: { avisInterpretations: trackdocument._id } }
    );
    res.json({ result: true }); // ✅ Un seul envoi
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

//dislike sur interpretation + update clés étrangères users
router.put("/dislike", async (req, res) => {
  const { track_id, email } = req.body;
  try {
    await Track.findOneAndUpdate(
      { track_spotify_id: track_id },
      { $inc: { dislikes_interpretation: 1 } }
    );
    const trackdocument = await Track.findOne({ track_spotify_id: track_id });

    await User.findOneAndUpdate(
      { email: email },
      { $addToSet: { avisInterpretations: trackdocument._id } }
    );

    res.json({ result: true }); // ✅ Un seul envoi
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
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

//recupere le preview url avec spotifyPreviewFinder
router.post("/previewUrl", async (req, res) => {
  const artistName = req.body.artistName;
  const trackName = req.body.trackName;
  const result = await spotifyPreviewFinder(trackName, artistName, 1);
  try {
    res.json({ result: true, previewUrl: result.results[0].previewUrls[0] });
  } catch {
    res.json({ result: false });
  }
});

//recuper les tracks en fonction des critères
router.post("/recommandations", async (req, res) => {
  try {
    const criteres = req.body; // tableau de strings

    const tracks = await Track.find({     
      $and: criteres.map(critere => ({    //$and: cherche toutes les combinaisons key:value qui suivent
        $or: [                            //$or: au moins l'une des options doit matcher
          { genres: critere },
          { thematiques: critere }
        ]
      }))
    });

    res.json({ result: true, tracks });
  } catch (err) {
    console.error(err);
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
