import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  questionList : [],
  questionNbr : null,
  answerList :[]
};

export const blindtestSlice = createSlice({
  name: "blindtest",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
    },
    closeModal: (state, action) => {
      state.isOpen = false;
    },
    addQuestionListToStore:(state, action)=>{
        state.questionList = action.payload;
        state.questionNbr = 0;
        state.answerList = []
    },
    addAnswerToStore:(state, action)=>{
        state.answerList.push(action.payload)
    },
    nextQuestion:(state,action)=>{
      state.questionNbr=state.questionNbr+1
    },
    resetQuiz: (state) => {
      
      state.questionNbr = 0;
      state.answerList = [];
      state.questionList = [];
    }

  },
});

export const { openModal, closeModal,addQuestionListToStore,addAnswerToStore,nextQuestion,resetQuiz } = blindtestSlice.actions;
export default blindtestSlice.reducer;
