const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
title : String,
track_spotify_id: String,
spotify_uri: String,
artist: String,
artist_spotify_id: String,
album_tracks_id: [String],
album_name: String,
album_image: String,
release_date: String,
lyrics: String,
interpretation: String,
thematiques: [String],
likes_interpretation: Number,
dislikes_interpretation: Number,
genres: [String],
duration_ms: Number
});

const Track = mongoose.model('tracks', trackSchema);

module.exports = Track;