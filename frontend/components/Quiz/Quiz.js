import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setQuestions, setResult, setUserAnswer } from "../../reducers/quiz";
import { getQuestions } from "./Questions";
import Image from "next/image";
import styles from "../../assets/scss/quiz/Quiz.module.scss";
import { getTracksUser } from "../../modules/spotify";
import { useRouter } from "next/router";
import Header from "./Header";

export default function Quiz({ Questions }) {
  const spotifyAccessToken = useSelector((state) => state.user.user.spotify.access_token);
  const dispatch = useDispatch();

  const router = useRouter();
  const { q } = router.query;


  const [questionsList, setQuestionsList] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (Questions && Questions.length > 0) {
          setQuestionsList(Questions);
          dispatch(setQuestions(Questions));
        } else {
          const data = await getTracksUser(spotifyAccessToken);
          const tracks = data.items.map((item) => item.track);
          const generatedQuestions = getQuestions(tracks);
          setQuestionsList(generatedQuestions);
          dispatch(setQuestions(generatedQuestions));
        }
      } catch (err) {
        console.log("Erreur lors du chargement des questions :", err);
      }
    };

    fetchQuestions();
  }, [spotifyAccessToken, Questions]);

  const handleAnswer = (selected) => {
    dispatch(
      setUserAnswer({ questionIndex: currentQuestion, answer: selected })
    );
    if (selected === questionsList[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };
  
  const myQuestion = questionsList[currentQuestion];

  if (currentQuestion >= questionsList.length) {
    dispatch(setResult({ score, total: questionsList.length }));
    return (
      <>
        <Header q={q} />
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <Image
                src="/img/cloudy_moon_nobg.png"
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
            Score : {score}/{questionsList.length}
          </p>
          <div className={styles.buttonContainer}>
            <button
              className={styles.endButton}
              onClick={() => {
                router.push("/quiz/correction");
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

  return (
    <>
      <Header q={q} />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Image
              src="/img/cloudy_moon_nobg.png"
              alt="Cloudy Moon"
              width={707}
              height={194}
              priority
            />
          </div>
        </div>
        {console.log(myQuestion)};
        
        {/* Afficher image si la question concernant une cover pop*/}
        {myQuestion.image && (
            <Image
              className={styles.cover}
              src={myQuestion.image}
              alt="Cover track"
              width={200}
              height={200}
            />
        )}
        <div className={styles.questionCard}>
          <span className={styles.counter}>
            {currentQuestion + 1}/{questionsList.length}
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
