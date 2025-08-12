import { createSlice } from "@reduxjs/toolkit";
import { getFavorites } from "../modules/listedefavoris";

const initialState = {
  value: {
    tracks: [],
  },
};

export const favorisSlice = createSlice({
  name: "favoris",

  initialState,
  reducers: {
    getFavoritesList: (state, action) => {
      state.value.tracks = action.payload
    },
    removeAFavorite: (state, action) => {
        state.value.tracks
    }
  }
})
export const {
    getFavoritesList,
    removeAFavorite
} = favorisSlice.actions;
export default favorisSlice.reducer;
