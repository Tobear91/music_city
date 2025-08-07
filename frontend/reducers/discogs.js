import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
};

export const discogsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { setUsername } = discogsSlice.actions;
export default discogsSlice.reducer;
