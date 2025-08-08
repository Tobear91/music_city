const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
title : String,
track_spotify_id: String,
spotify_uri: String,
previewUrl: String,
artist: String,
artist_spotify_id: String,
album_tracks_id: [String],
release_date: Date,
lyrics: String,
interpretation: String,
thematiques: [String],
likes_interpretation: Number,
dislikes_interpretation: Number,

instruments: [String], 
genres: [String],
});

const Track = mongoose.model('tracks', trackSchema);

module.exports = Track;