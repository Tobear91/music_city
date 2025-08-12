const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  email: String,
  questions: [
    {
      question: String,
      userAnswer: String,
      correctAnswer: String,
    }
  ],
  score: Number,
  total: Number,
});

module.exports = mongoose.model("quizresult", quizResultSchema);