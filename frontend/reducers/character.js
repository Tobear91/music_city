import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  position: {xPos:2590, yPos:3270,name:null,xPosBuilding:null,yPosBuilding:null},
};


export const characterSlice = createSlice({
  name: "character",
  initialState,
  reducers: {
    setPosition: (state, action) => {
      state.position = action.payload; //action.payload = {xPosition:....,yPosition:....}
    },
    // deplace le perso de 50px vers le bas pour ne plus etre dans le building à la femretur ede la page
    leaveBuilding:(state)=>{
      state.position.name = null
      state.position.yPos = state.position.yPosBuilding + 50;
      state.position.xPos = state.position.xPosBuilding;
    }
  },
});

export const { setPosition,leaveBuilding } = characterSlice.actions;
export default characterSlice.reducer;
