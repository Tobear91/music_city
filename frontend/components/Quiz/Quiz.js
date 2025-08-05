import { useState } from 'react';
import { myQuestions } from './Questions.js';


export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  // Limiter le quiz a 10 question
  const limitedQuestions = myQuestions.slice(0, 10); 

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === limitedQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  if (currentQuestion >= limitedQuestions.length) {
    return (
      <div>
        <h2>Quiz terminé !</h2>
        <p>Score : {score}/{limitedQuestions.length}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>{limitedQuestions[currentQuestion].question}</h2>
      <p>Question {currentQuestion + 1}/{limitedQuestions.length}</p>

      <div>
        {limitedQuestions[currentQuestion].options.map((option, index) => (
          <button 
            key={index} 
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
``
