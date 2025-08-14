import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  wantlist_items: [],
  collection_items: [],
};

export const discogsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    toggleWantlistItem: (state, action) => {
      const isInclude = state.wantlist_items.includes(action.payload);
      isInclude ? state.wantlist_items.filter((item) => item !== action.payload) : state.wantlist_items.push(action.payload);
    },
    setWantlist: (state, action) => {
      state.wantlist_items = action.payload;
    },
    toggleCollectionItem: (state, action) => {
      const isInclude = state.collection_items.includes(action.payload);
      isInclude ? state.collection_items.filter((item) => item !== action.payload) : state.collection_items.push(action.payload);
    },
    setCollection: (state, action) => {
      state.collection_items = action.payload;
    },
  },
});

export const { setUsername, toggleWantlistItem, setWantlist, toggleCollectionItem, setCollection } = discogsSlice.actions;
export default discogsSlice.reducer;
