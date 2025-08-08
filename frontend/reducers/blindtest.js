import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questionList : [],
  questionNbr : null,
  answerList :[]
};

export const blindtestSlice = createSlice({
  name: "blindtest",
  initialState,
  reducers: {

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
