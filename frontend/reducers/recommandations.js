import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    tracks: [],
  },
};

export const recommandationsSlice = createSlice({
  name: "recommandations",

  initialState,
  reducers: {
    setRecommandationsList: (state, action) => {
      state.value.tracks = action.payload.map((e) => ({
        track_id: e.track_spotify_id,
        title: e.title,
        artist: e.artist,
        duration_ms: e.duration_ms,
        uri: e.uri,
      }));
    },
    resetRecommandationsList: (state, action) => {
      state.value.tracks = []
    }
  },
});

export const { setRecommandationsList, resetRecommandationsList } = recommandationsSlice.actions;
export default recommandationsSlice.reducer;
