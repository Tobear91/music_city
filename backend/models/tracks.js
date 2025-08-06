const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
title : String,
track_spotify_id: String,
spotify_uri: String,
previewUrl: String,
artist: String,
artist_spotify_id: String,
album: String,
album_spotify_id: String,
album_tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "tracks" }],
date: Date,
lyrics: String,
interpretation: String,
thematiques: [String],
instruments: [String], 
genres: [String],
});

const Track = mongoose.model('tracks', trackSchema);

module.exports = Track;