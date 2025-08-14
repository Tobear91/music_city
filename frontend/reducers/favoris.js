import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  value: {
    tracks: [],
  },
};

export const favorisSlice = createSlice({
  name: "favoris",

  initialState,
  reducers: {
    getFavoritesListInStore: (state, action) => {
      state.value.tracks = action.payload.map((track, index) => { return {
        track_id: track.track_spotify_id,
        title: track.title,
        artist: track.artist,
        duration_ms: track.duration_ms
      }  
    })
    },
    removeAFavoriteFromStore: (state, action) => {
        state.value.tracks = state.value.tracks.filter(e => e.track_id !== action.payload)
    }
  }
})
export const {
    getFavoritesListInStore,
    removeAFavoriteFromStore
} = favorisSlice.actions;
export default favorisSlice.reducer;
