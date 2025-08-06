import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    tracks: [] 
  },
};

export const recommandationsSlice = createSlice({
  name: "recommandations",

  initialState,
  reducers: {
    fetchedRecommandations: (state, action) => {
      console.log("recommandations tracks from action.payload")
}}});

export const { fetchedRecommandations } =
  recommandationsSlice.actions;
export default recommandationsSlice.reducer;
