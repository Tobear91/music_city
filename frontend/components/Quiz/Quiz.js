import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getQuestions } from "./Questions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "../../assets/scss/quiz/Quiz.module.scss";
import { getTracksUser } from "../../modules/spotify";
import { useRouter } from "next/router";
import Header from "./Header";

export default function Quiz({ questions: Questions }) {
  const spotifyAccessToken = useSelector(
    (state) => state.user.user.spotify.access_token
  );

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const router = useRouter();
  const { q } = router.query;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (Questions && Questions.length > 0) {
          setQuestions(Questions);
        } else {
          const data = await getTracksUser(spotifyAccessToken);
          const tracks = data.items.map((item) => item.track);
          const generatedQuestions = getQuestions(tracks);
          setQuestions(generatedQuestions);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des questions :", err);
      }
    };

    fetchQuestions();
  }, [spotifyAccessToken, Questions]);

  const handleAnswer = (selected) => {
    if (selected === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  if (currentQuestion >= questions.length) {
    return (
      <>
        <Header q={q} />
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
              onClick={() => {
                localStorage.setItem(
                  "quizQuestions",
                  JSON.stringify(questions)
                );
                router.push({
                  pathname: "/quiz/correction",
                  query: { score, total: questions.length },
                });
              }}
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
      <Header q={q} />
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
