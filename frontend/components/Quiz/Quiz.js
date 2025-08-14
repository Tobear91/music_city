import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setQuestions, setResult, setUserAnswer } from "../../reducers/quiz";
import { getQuestions } from "./Questions";
import Image from "next/image";
import styles from "../../assets/scss/quiz/Quiz.module.scss";
import { getTracksUser } from "../../modules/spotify";
import { useRouter } from "next/router";
import Header from "./Header";

export default function Quiz({ initialQuestions }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { q, id } = router.query;

  useEffect(() => {
    if (!initialQuestions) {
      if (id === "qui") {
        // charger morceaux aléatoires depuis Spotify
      } else if (id === "playlist") {
        // aller chercher les morceaux d'une playlist
      }
    }
  }, [id, initialQuestions]);

  const spotifyAccessToken = useSelector(
    (state) => state.user.user.spotify.access_token
  );
  const userId = useSelector((state) => state.user.user._id);
  const email = useSelector((state) => state.user.user.email);
  const questionsAnswers = useSelector((state) => state.quiz.questions);

  const [questionsList, setQuestionsList] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  // Charger les questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        //  questions en props reçu
        if (initialQuestions && initialQuestions.length > 0) {
          setQuestionsList(initialQuestions);
          dispatch(setQuestions(initialQuestions));
        } else {
          // Sinon, on va chercher les titres Spotify de l'utilisateur
          const data = await getTracksUser(spotifyAccessToken);
          const tracks = data.items.map((item) => item.track);
          const generatedQuestions = getQuestions(tracks);
          setQuestionsList(generatedQuestions);
          dispatch(setQuestions(generatedQuestions));
        }
      } catch (err) {
        console.error("Erreur lors du chargement des questions :", err);
      }
    };

    fetchQuestions();
  }, [spotifyAccessToken, initialQuestions]);

  // Sauvegarde en BDD a la fin du quiz
  useEffect(() => {
    const isFinished = currentQuestion === questionsAnswers.length;

    if (isFinished) {
      dispatch(setResult({ score, total: questionsAnswers.length }));

      fetch("http://localhost:3000/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email,
          questions: questionsAnswers,
          score,
          total: questionsList.length,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            console.log("Quiz enregistré avec succès !");
          } else {
            console.error("Erreur enregistrement quiz :", data.error);
          }
        });
    }
  }, [currentQuestion, questionsList, score, userId, email, dispatch]);

  // Réponse utilisateur, ajout d'un point par bonne réponse
  const handleAnswer = (selected) => {
    dispatch(
      setUserAnswer({ questionIndex: currentQuestion, answer: selected })
    );
    if (selected === questionsList[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  // Affichage fin de Quiz
  if (currentQuestion >= questionsList.length) {
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
              onClick={() =>router.push("/quiz")}
            >
              Rejouer un quiz
            </button>
          </div>
        </div>
      </>
    );
  }

  // Ecran des Questions
  const myQuestion = questionsList[currentQuestion];
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
        {/* Afficher image si la question concerne une pochette*/}
        {myQuestion.image && (
          <Image
            className={styles.cover}
            src={myQuestion.image}
            alt="image track"
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
