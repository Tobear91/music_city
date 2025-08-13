import { useEffect, useState } from "react";
import styles from "../../assets/scss/blindtest/Questions.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  nextQuestion,
  addAnswerToStore,
  setCorrectionAndScore,
} from "../../reducers/blindtest";
import Image from "next/image";
import { useRouter } from "next/router";
import Header from "./Header";
import QuestionElement from "./QuestionElement";
import ResponseElement from "./ResponseElement";

import {
  saveAnswer,
  getUpdatedAnswerList,
  calculateCorrectionAndScore,
  addAllShows,
} from "../../modules/blindtest/checkResults";

export default function Questions() {
  const dispatch = useDispatch();
  const router = useRouter();

  // État local pour la réponse courante et fin du quiz
  const [currentAnswer, setCurrentAnswer] = useState({
    answer: "",
    showActor: false,
    showPoster: false,
  });
  const [dispEndQuizz, setDispEndQuiz] = useState(false);

  // Récupération des données du store
  const blindtestInfo = useSelector((state) => state.blindtest);
  const email = useSelector((state) => state.user.user.email);

  // Passe à la question suivante
  const handleNextQuestion = () => {
    saveAnswer(dispatch, currentAnswer, addAnswerToStore);
    setCurrentAnswer({ answer: "", showActor: false, showPoster: false });
    dispatch(nextQuestion());
  };

  // Terminer le quiz et envoyer les résultats
  const handleFinishQuiz = async () => {
    const updatedAnswerList = getUpdatedAnswerList(
      blindtestInfo,
      currentAnswer
    );
    // Calcul des corrections et score
    const { correction, score } = calculateCorrectionAndScore(
      blindtestInfo,
      updatedAnswerList
    );
    // Calcul des corrections et score
    await dispatch(setCorrectionAndScore({ correction, score }));
    await saveAnswer(dispatch, currentAnswer, addAnswerToStore);

    // Ajout des shows dans la BDD
    await addAllShows(blindtestInfo.questionList);

    // Préparation des données
    const questions = blindtestInfo.questionList.map((q, index) => ({
      showid: q.id,
      userAnswer: updatedAnswerList[index].answer,
      actorRevealed: updatedAnswerList[index].showActor,
      posterRevealed: updatedAnswerList[index].showPoster,
      isCorrect: correction[index].isCorrect,
    }));

    // Envoi des résultats à la BDD
    fetch("http://127.0.0.1:3000/blindtest/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, Score: score, Type: "serie", questions }),
    }).catch((err) => console.error("Erreur lors de l'enregistrement :", err));

    router.push("./results"); // Redirection vers la page résultats
  };

  // Vérifie si on est sur la dernière question pour afficher le bouton de fin
  useEffect(() => {
    if (blindtestInfo.questionNbr + 1 >= blindtestInfo.questionList.length)
      setDispEndQuiz(true);
  }, [blindtestInfo.questionNbr]);

  return (
    <div className={styles.modalOverlay}>
      <Header></Header>
      <div className={styles.mainContainer}>
        <Image
          src="/img/cloudy_moon.jpg"
          alt="Cloudy Moon"
          width={707}
          height={194}
          priority
        />
        <div className={styles.overlaySection}>
          <QuestionElement
            previewUrl={
              blindtestInfo.questionList[blindtestInfo.questionNbr].previewURL
            }
            totalQuestion={blindtestInfo.questionList.length}
            questioNumber={blindtestInfo.questionNbr + 1}
            isCertain={
              blindtestInfo.questionList[blindtestInfo.questionNbr]
                .isTrackMatchCertain
            }
          ></QuestionElement>
          <ResponseElement
            mainActor={
              blindtestInfo.questionList[blindtestInfo.questionNbr].mainActor
            }
            posterUrl={
              blindtestInfo.questionList[blindtestInfo.questionNbr].posterPath
            }
            currentAnswer={currentAnswer}
            setCurrentAnswer={setCurrentAnswer}
          ></ResponseElement>

          {!dispEndQuizz && (
            <div className={styles.buttonContainer}>
              <button
                className={styles.nextButton}
                onClick={handleNextQuestion}
              >
                Question suivante{" "}
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className={styles.nextFa}
                />
              </button>
            </div>
          )}

          {dispEndQuizz && (
            <div className={styles.buttonContainer} onClick={handleFinishQuiz}>
              <button className={styles.nextButton}>
                Terminer le quizz{" "}
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className={styles.nextFa}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
