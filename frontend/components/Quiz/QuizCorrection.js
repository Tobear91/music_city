import styles from "../../assets/scss/quiz/QuizCorrection.module.scss";

export default function QuizCorrection({ questions }) {
  return (
    <div>
      <h3>Correction du quiz</h3>
      {questions.map((myQuestion, index) => (
        <div key={index}>
          <p>Question {index + 1}: {myQuestion.question}</p>
          <p>Réponse correcte : {myQuestion.correctAnswer}</p>
        </div>
      ))}
    </div>
  );
}