import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { criteres: [] },
};

export const criteresSlice = createSlice({
  name: "criteres",

  initialState,
  reducers: {
    addToCriteres: (state, action) => {
      state.value.criteres.push(action.payload);
    },

    removeFromCriteres: (state, action) => {
      state.value.criteres = state.value.criteres.filter(
        (e) => e !== action.payload
      );
    },
    resetCriteres: (state, action) => {
      state.value.criteres = [];
    },
  },
});

export const { addToCriteres, removeFromCriteres, resetCriteres } =
  criteresSlice.actions;
export default criteresSlice.reducer;
