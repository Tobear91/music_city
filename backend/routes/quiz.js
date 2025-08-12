const express = require("express");
const router = express.Router();
const quizresult = require("../models/quiz/quizResult"); 

// Sauver un quiz
router.post("/", (req, res) => {

  const newQuiz = new quizresult({
    userId: req.body.userId,
    email: req.body.email,
    questions: req.body.questions,
    score: req.body.score,
    total: req.body.total
  });

  newQuiz.save().then(savedDoc => {
    res.json({ result: true, quiz: savedDoc });
  }).catch(err => {
    res.json({ result: false, error: err });
  });
});

module.exports = router;
