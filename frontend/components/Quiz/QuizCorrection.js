import styles from "../../assets/scss/quiz/QuizCorrection.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function QuizCorrection() {
  const router = useRouter();
  const { score, total } = router.query;

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("quizQuestions");
    if (stored) {
      setQuestions(JSON.parse(stored));
    }
  }, []);

  return (
    <div>
      <h3>Correction du quiz</h3>
      <p>
        Score : {score}/{total}
      </p>
      {questions.map((myQuestion, index) => (
        <div key={index}>
          <p>
            Question {index + 1}: {myQuestion.question}
          </p>
          <p>Réponse correcte : {myQuestion.correctAnswer}</p>
        </div>
      ))}
    </div>
  );
}
