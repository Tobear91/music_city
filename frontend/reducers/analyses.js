import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    track_id: "",
    artist_id: "",
    uri: '',
    lyrics: { title: "", artist: "", lyrics: "" },
    album: { album_id: "", name: "", image: "", date: "", tracks: [] },
    interpretation: "",
    themes: [],
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
      state.value.lyrics.title = track.name;
      state.value.lyrics.artist = track.artists[0].name;

      state.value.album.name = track.album.name;
      state.value.album.album_id = track.album.id;
      state.value.album.date = track.album.release_date;
      state.value.album.image = track.album.images[0].url;

      state.value.album.tracks = []; // à remplir après appel à `/albums/:id/tracks`

      state.value.metadatas = {
        duration_ms: track.duration_ms,
      };

      state.value.genres = []; // à remplir après appel à `/artists/:id` ou ???
      state.value.themes = []; // à remplir aprés l'interpretation llm
      state.value.interpretation = ""; // idem
    },
    getAlbumTracks: (state, action) => {
      const tracks = action.payload;

      for (let i = 0; i < tracks.length; i++) {
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
    getAudioFeatures: (state, action) => {
      state.value.metadatas = {
        ...state.value.metadatas,
        duration_ms: action.payload.duration_ms,
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
  },
});

export const { newTrackFromSPO, getAlbumTracks, getLyrics, getGenres, getAudioFeatures } =
  analysesSlice.actions;
export default analysesSlice.reducer;
