import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],
  score: 0,
  total: 0,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuestions(state, action) {
      state.questions = action.payload || [];
      state.score = 0;
      state.total = state.questions.length;
    },
    setResult(state, action) {
      state.score = action.payload.score;
      state.total = state.total = action.payload.total;
    },
    setUserAnswer(state, action) {
      state.questions[action.payload.questionIndex].userAnswer =
        action.payload.answer;
    },
  },
});

export const { setQuestions, setResult, setUserAnswer } = quizSlice.actions;
export default quizSlice.reducer;
