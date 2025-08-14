const express = require("express");
const router = express.Router();
const quizresult = require("../models/quiz/quizResult"); 

// Sauver un quiz en BDD
router.post("/", (req, res) => {
  const { userId, email, questions, score, total } = req.body;

  const newQuiz = new quizresult({
    userId,
    email,
    questions,
    score,
    total
  });

  newQuiz.save().then(savedDoc => {
    res.json({ result: true, quiz: savedDoc });
  }).catch(err => {
    res.json({ result: false, error: err });
  });
});

module.exports = router;
