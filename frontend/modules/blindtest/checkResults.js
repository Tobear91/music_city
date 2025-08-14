import stringSimilarity from "string-similarity";

function checkCorrection(correctAnswer, userAnswer) {
  // utilise stringsimialtiry pour savori si la réponse données est identifque au nom de la série
  const threshold = 0.7;
  const safeCorrect = (correctAnswer || "").trim().toLowerCase();
  const safeUser = (userAnswer || "").trim().toLowerCase();
  const similarity = stringSimilarity.compareTwoStrings(safeCorrect, safeUser);
  return similarity >= threshold;
}

export function descriptionLevel(score) {
  // retourne une description en fonction du score
  if (score <= 5) {
    return "Débutant — vous explorez encore le monde des séries";
  } else if (score <= 10) {
    return "Intermédiaire — vous regardez des séries de temps en temps";
  } else {
    return "Expert — les séries n'ont (presque) plus de secrets pour vous";
  }
}

export const saveAnswer = (dispatch, currentAnswer, addAnswerToStore) => {
  //enregistre les réponses dans le strore
  dispatch(addAnswerToStore(currentAnswer));
};

export const getUpdatedAnswerList = (blindtestInfo, currentAnswer) => {
  // mets à jours la liste de réponses locale
  return [...blindtestInfo.answerList, currentAnswer];
};

export const calculateCorrectionAndScore = (
  blindtestInfo,
  updatedAnswerList //calcul le score de l'utilsateur par question en fonction d'une nombre indice révélés et de la réponse.
) => {
  const correctionList = blindtestInfo.questionList.map((q) => q.title);

  const correction = correctionList.map((correctAnswer, i) => {
    const userAnswer = updatedAnswerList[i].answer;
    const showActor = updatedAnswerList[i].showActor;
    const showPoster = updatedAnswerList[i].showPoster;

    const isCorrect = userAnswer
      ? checkCorrection(correctAnswer, userAnswer)
      : false;
    const indiceNbr = (showPoster ? 1 : 0) + (showActor ? 1 : 0);

    return { isCorrect, userAnswer, correctAnswer, indiceNbr };
  });

  const score = correction.reduce((total, item) => {
    if (!item.isCorrect) return total;
    if (item.indiceNbr === 0) return total + 3;
    if (item.indiceNbr === 1) return total + 2;
    if (item.indiceNbr === 2) return total + 1;
    return total;
  }, 0);

  return { correction, score };
};

export const addAllShows = async (questionList) => {
  const url = "http://127.0.0.1:3000/blindtest/newshow";

  await Promise.all(
    questionList.map((show) => {
      const body = {
        type: "serie",
        tmbdId: show.id,
        name: show.title,
        posterPath: show.posterPath,
        mainActor: show.mainActor,
        platform: show.platform,
        soundtrackName: show.soundtrack,
        soundtrackArtist: show.artistName,
        soundtrackPreview: show.previewURL,
        soundtrackSpotifyId: show.trackId,
        isPreviewCertain: show.isTrackMatchCertain,
      };

      return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch((err) => console.error("Erreur ajout show :", err));
    })
  );
};
