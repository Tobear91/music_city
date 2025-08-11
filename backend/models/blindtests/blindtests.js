const mongoose = require("mongoose");


const questionSchema = mongoose.Schema({
 show: { type: mongoose.Schema.Types.ObjectId, ref: "shows" },
 userAnswer: String,
 actorRevealed:Boolean,
 posterRevealed:Boolean,
 isCorrect : Boolean,
});


const blindtestSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    Score: Number,
    Type:String,
    question: [questionSchema],
  },
)


const Blindtest = mongoose.model("blindtests", blindtestSchema);

module.exports = Blindtest;