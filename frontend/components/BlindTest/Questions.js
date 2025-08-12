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
import { checkCorrection } from "../../modules/checkCorrection";
import Header from "./Header";
import QuestionElement from "./QuestionElement";
import ResponseElement from "./ResponseElement";

export default function Questions() {
  const dispatch = useDispatch();

  const router = useRouter();
  const [currentAnswer, setCurrentAnswer] = useState({
    answer: "",
    showActor: false,
    showPoster: false,
  });
  const blindtestInfo = useSelector((state) => state.blindtest);
  const email = useSelector((state) => state.user.user.email);

  const [dispEndQuizz, setDispEndQuiz] = useState(false);

  const saveCurrentAnswer = () => {
    dispatch(addAnswerToStore(currentAnswer));
    setCurrentAnswer({ answer: "", showActor: false, showPoster: false });
  };

  // cettre fonction permet d'attendre que tous les show soient ajoutés a la database poru ocntinuer
  async function addAllShows() {
    const url = "http://127.0.0.1:3000/blindtest/newshow";
    const allShows = blindtestInfo.questionList;

    await Promise.all(
      allShows.map((showToAdd) => {
        const body = {
          type: "serie",
          tmbdId: showToAdd.id,
          name: showToAdd.title,
          posterPath: showToAdd.posterPath,
          mainActor: showToAdd.mainActor,
          platform: showToAdd.platform,
          soundtrackName: showToAdd.soundtrack,
          soundtrackArtist: showToAdd.artistName,
          soundtrackPreview: showToAdd.previewURL,
          soundtrackSpotifyId: showToAdd.trackId,
          isPreviewCertain: showToAdd.isTrackMatchCertain,
        };

        return fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
          .then((res) => res.json())
          .then((data) => console.log("Show ajouté :", data))
          .catch((err) => console.error("Erreur ajout show :", err));
      })
    );
  }

  const handleFinishQuiz = async () => {
    const updatedAnswerList = [...blindtestInfo.answerList, currentAnswer];
    const correctionList = blindtestInfo.questionList.map((q) => q.title);
    let correction = [];
    for (let i = 0; i < correctionList.length; i++) {
      correction.push({
        isCorrect: updatedAnswerList[i].answer
          ? checkCorrection(correctionList[i], updatedAnswerList[i].answer)
          : false, // si pas de réponse, pas correct
        userAnswer: updatedAnswerList[i].answer,
        correctAnswer: correctionList[i],
        indiceNbr:
          (updatedAnswerList[i].showPoster ? 1 : 0) +
          (updatedAnswerList[i].showActor ? 1 : 0),
      });
    }
    let score = correction.reduce((total, item) => {
      if (!item.isCorrect) {
        return total;
      } else {
        if (item.indiceNbr === 0) return total + 3;
        if (item.indiceNbr === 1) return total + 2;
        if (item.indiceNbr === 2) return total + 1;
        return total;
      }
    }, 0);
    dispatch(setCorrectionAndScore({ correction, score }));
    dispatch(addAnswerToStore(currentAnswer));

    // ajotu des serie dans la BDD
    await addAllShows();
    const Score = blindtestInfo.score;
    const Type = "serie";
    const questions = blindtestInfo.questionList.map((q, index) => ({
      showid: q.id,
      userAnswer: updatedAnswerList[index].answer,
      actorRevealed: updatedAnswerList[index].showActor,
      posterRevealed: updatedAnswerList[index].showPoster,
      isCorrect: blindtestInfo.correction[index].isCorrect,
    }));
    fetch("http://127.0.0.1:3000/blindtest/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, Score, Type, questions }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Blindtest enregistré :", data);
      })
      .catch((err) => {
        console.error("Erreur lors de l'enregistrement :", err);
      });

    router.push("./results");
  };

  const handleNextQuestion = () => {
    saveCurrentAnswer();
    dispatch(nextQuestion());
  };

  useEffect(() => {
    if (blindtestInfo.questionNbr + 1 >= blindtestInfo.questionList.length) {
      setDispEndQuiz(true);
    }
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
