const mongoose = require("mongoose");


const questionSchema = mongoose.Schema({
 tracks: { type: mongoose.Schema.Types.ObjectId, ref: "tracks" },
 userAnswer: String,
 isCOrret : Boolean,
});


const blindtestSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    Score: Number,
    question: [questionSchema],
  },
)


const Blindtest = mongoose.model("blindtests", blindtestSchema);

module.exports = Blindtest;