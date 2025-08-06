import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getQuestions } from './Questions';
import styles from './Quiz.module.css';
import QuizCorrection from './QuizCorrection';


export default function Quiz() {

  const spotifyAccessToken = useSelector(state => state.user.user.spotify.access_token);
  console.log(spotifyAccessToken)

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showCorrection, setShowCorrection] = useState(false);


  useEffect(() => {
    const fetchQuestions = async () => {
      if (!spotifyAccessToken) return;
      const question = await getQuestions(spotifyAccessToken);
      setQuestions(question);
    };

    fetchQuestions();
  }, [spotifyAccessToken]);

  const handleAnswer = (selected) => {
    if (selected === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  if (currentQuestion >= questions.length) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quiz terminé !</h2>
      <p className={styles.score}>Score : {score}/{questions.length}</p>
      
        <button
          className={styles.answerButton}
          onClick={() => setShowCorrection(true)}
        >
          Voir correction
        </button>
      
    </div>
  );
}


  const myQuestion = questions[currentQuestion];
  

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>QUIZ</h1></div>
      <div className={styles.questionCard}>
        <span className={styles.counter}>{currentQuestion + 1}/{questions.length}</span>
        <h2 className={styles.questionText}>{myQuestion.question}</h2>
      </div>
      <div className={styles.answers}>
        {myQuestion.options.map((option, i) => (
          <button key={i} onClick={() => handleAnswer(option)} className={styles.answerButton}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
