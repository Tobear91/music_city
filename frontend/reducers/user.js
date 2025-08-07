import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setSpotifyToken: (state, action) => {
      state.user.spotify.access_token = action.payload;
    },
    setDiscogs: (state, action) => {
      state.user.discogs = action.payload;
    },
  },
});

export const { setUser, setSpotifyToken, setDiscogs } = userSlice.actions;
export default userSlice.reducer;
