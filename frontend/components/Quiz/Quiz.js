import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getQuestions } from "./Questions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "../../assets/scss/quiz/Quiz.module.scss";
import QuizCorrection from "./QuizCorrection";

export default function Quiz() {
  const spotifyAccessToken = useSelector(
    (state) => state.user.user.spotify.access_token
  );
  console.log(spotifyAccessToken);

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
    if (showCorrection) {
      return <QuizCorrection questions={questions} />;
    }

    return (
      <>
        <div className={styles.menuBar}>
          <FontAwesomeIcon
            icon={faCircleXmark}
            className={styles.crossClose}
            style={{ width: "40px", height: "40px" }}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <Image
                src="/img/cloudy_moon.jpg"
                alt="Cloudy Moon"
                width={707}
                height={194}
                priority
              />
            </div>
            <div>
              <h1 className={styles.title}>QUIZ TERMINE !</h1>
            </div>
          </div>
          <p className={styles.score}>
            Score : {score}/{questions.length}
          </p>
          <div className={styles.buttonContainer}>
            <button
              className={styles.endButton}
              onClick={() => setShowCorrection(true)}
            >
              Voir correction
            </button>
            <button
              className={styles.endButton}
              onClick={() => window.location.reload()}
            >
              Rejouer un quiz
            </button>
          </div>
        </div>
      </>
    );
  }

  const myQuestion = questions[currentQuestion];

  return (
    <>
      <div className={styles.menuBar}>
        <FontAwesomeIcon
          icon={faCircleXmark}
          className={styles.crossClose}
          style={{ width: "40px", height: "40px" }}
        />
        <div>
          <h1 className={styles.title}>QUIZ</h1>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Image
              src="/img/cloudy_moon.jpg"
              alt="Cloudy Moon"
              width={707}
              height={194}
              priority
            />
          </div>
        </div>
        <div className={styles.questionCard}>
          <span className={styles.counter}>
            {currentQuestion + 1}/{questions.length}
          </span>
          <h2 className={styles.questionText}>{myQuestion.question}</h2>
        </div>
        <div className={styles.answers}>
          {myQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              className={styles.answerButton}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
