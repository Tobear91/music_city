import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questionList : [],
  questionNbr : null,
  answerList :[],
  correction:[],
  score:0,
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
    },
    setCorrectionAndScore: (state, action) => {
    state.correction = action.payload.correction;
    state.score = action.payload.score;
},


  },
});

export const { openModal, closeModal,addQuestionListToStore,addAnswerToStore,nextQuestion,resetQuiz,setCorrectionAndScore} = blindtestSlice.actions;
export default blindtestSlice.reducer;
