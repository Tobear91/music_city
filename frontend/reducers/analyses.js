import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    track_id: "",
    artist_id: "",
    uri: "",
    duration_ms: 0,
    release_date: "",
    preview_url: "",
    lyrics: { title: "", artist: "", lyrics: "" },
    album: { album_id: "", name: "", image: "", date: "", tracks: [] },
    interpretation_by_ai: {
      interpretation: "",
      themes: [],
      likes: 0,
      dislikes: 0,
    },
    metadatas: {},
    genres: [],
  },
};

export const analysesSlice = createSlice({
  name: "analyses",

  initialState,
  reducers: {
    newTrackFromSPO: (state, action) => {
      const track = action.payload.tracks.items[0];
      state.value.track_id = track.id;
      state.value.artist_id = track.artists[0].id;
      state.value.uri = track.uri;
      state.value.duration_ms = track.duration_ms;
      state.value.release_date = track.album.release_date;
      state.value.preview_url = track.preview_url;
      state.value.lyrics.title = track.name;
      state.value.lyrics.artist = track.artists[0].name;

      state.value.album.name = track.album.name;
      state.value.album.album_id = track.album.id;
      state.value.album.date = track.album.release_date;
      state.value.album.image = track.album.images[0].url;
      state.value.album.tracks = []; // à remplir après appel à `/albums/:id/tracks`

      state.value.genres = []; // à remplir après appel à `/artists/:id` ou ???

      state.value.interpretation_by_ai.interpretation = "";
      state.value.interpretation_by_ai.themes = [];
      state.value.interpretation_by_ai.likes = 0;
      state.value.interpretation_by_ai.dislikes = 0;
    },

    getTrackFromDatabase: (state, action) => {
      const track = action.payload.track;
      state.value.track_id = track.track_spotify_id;
      state.value.artist_id = track.artist;
      state.value.uri = track.spotify_uri;
      state.value.duration_ms = track.duration_ms;
      state.value.release_date = track.release_date;
      state.value.preview_url = track.preview_url;
      state.value.lyrics.title = track.title;
      state.value.lyrics.artist = track.artist;
      state.value.lyrics.lyrics = track.lyrics;

      state.value.album.name = track.album;
      state.value.album.album_id = track.album_tracks_id;
      state.value.album.date = track.release_date;
      state.value.album.image = track.album_image;
      state.value.album.tracks = []; 

      state.value.genres = track.genres || [];
      state.value.interpretation_by_ai.interpretation = track.interpretation || "";
      state.value.interpretation_by_ai.themes = track.thematiques || [];
      state.value.interpretation_by_ai.likes = 0;
      state.value.interpretation_by_ai.dislikes = 0;
    },

    getAlbumTracks: (state, action) => {
      const tracks = action.payload;

      for (let i = 0; i < tracks.length; i++) {
        // console.log("Track:", tracks[i]);
        const track = {
          track_number: tracks[i].track_number,
          name: tracks[i].name,
          id: tracks[i].id,
          uri: tracks[i].uri,
          duration_ms: tracks[i].duration_ms,
        };
        state.value.album.tracks.push(track);
      }
    },
    getLyrics: (state, action) => {
      state.value.lyrics.lyrics = action.payload;
    },
    getGenres: (state, action) => {
      if (action.payload.length === 0) {
        console.log("pas de genres associés par spotify");
        return;
      }
      action.payload.map((e) => state.value.genres.push(e));
    },

    getInterpretationAndThemes: (state, action) => {
      state.value.interpretation_by_ai.interpretation =
        action.payload.interpretation.interpretation;
      state.value.interpretation_by_ai.themes =
        action.payload.interpretation.themes;
    },

    getAudioFeatures: (state, action) => {
      state.value.metadatas = {
        acousticness: action.payload.acousticness,
        danceability: action.payload.danceability,
        energy: action.payload.energy,
        instrumentalness: action.payload.instrumentalness,
        key: action.payload.key,
        liveness: action.payload.liveness,
        loudness: action.payload.loudness,
        mode: action.payload.mode,
        speechiness: action.payload.speechiness,
        tempo: action.payload.tempo,
        time_signature: action.payload.time_signature,
        valence: action.payload.valence,
      };
    },
    resetAnalyses: (state) => {
      state.value = initialState.value;
    },
    addALike: (state, action) => {
      state.value.interpretation_by_ai.likes += 1;
    },
    addADislike: (state, action) => {
      state.value.interpretation_by_ai.dislikes += 1;
    },
  },
});

export const {
  newTrackFromSPO,
  getAlbumTracks,
  getLyrics,
  getGenres,
  getAudioFeatures,
  getInterpretationAndThemes,
  resetAnalyses,
  getTrackFromDatabase,
  addALike,
  addADislike,
} = analysesSlice.actions;
export default analysesSlice.reducer;
