import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  wantlist_items: [],
};

export const discogsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    toggleWantlistItem: (state, action) => {
      if (state.wantlist_items.includes(action.payload)) {
        state.wantlist_items = state.wantlist_items.filter((item) => item !== action.payload);
      } else {
        state.wantlist_items.push(action.payload);
      }
    },
    setWantlist: (state, action) => {
      state.wantlist_items = action.payload;
    },
  },
});

export const { setUsername, toggleWantlistItem, setWantlist } = discogsSlice.actions;
export default discogsSlice.reducer;
