import styles from "../../assets/scss/blindtest/Home.module.scss";
import LoadingScreens from "./LoadingScreens";
import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faXmark,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { addQuestionListToStore } from "../../reducers/blindtest";
import { useRouter } from "next/router";
import { leaveApplication } from "../../modules/appinteraction";
import {
  fetchRandomShow,
  findBestAlbumForSeries,
  getFirstTrack,
  getSpotifyPreviewUrl,
  buildEnrichedSerie,
} from "../../modules/blindtest/getSeries";

export default function Home() {
  const [dispLoadingScreen, setDispLoadingScreen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // lancement du quizz
  const initializeQuiz = (series) => {
    dispatch(addQuestionListToStore(series));
    router.push("./blindtest-serie/questions");
  };

  // retourne sur la map
  const handleLeaveBuilding = () => {
    leaveApplication(router);
  };
  const handleStartQuiz = async () => {
    //affiche écran de chargement
    setDispLoadingScreen(true);

    //récupération de 5 séries parmis les 10 récupérés de base
    const requiredCount = 5;
    const data = await fetchRandomShow();
    const validSeries = [];
    const maxSeries = data.series.length;

    // on prend chaque série parmi les 01 récupérés et on check si on arrive à récupérer une previewurl, si on y arrive pas on ne garde pas la série.
    for (let i = 0; i < maxSeries && validSeries.length < requiredCount; i++) {
      const serie = data.series[i];

      const { bestAlbum, bestScore } = await findBestAlbumForSeries(
        serie.title,
        serie.platform
      );
      if (!bestAlbum) continue;

      const firstTrack = await getFirstTrack(bestAlbum.id);
      if (!firstTrack?.trackId) continue;

      const previewUrl = await getSpotifyPreviewUrl(
        firstTrack.artistName,
        firstTrack.trackName
      );
      if (!previewUrl) continue;
      // on prend les infos qui nous intéressent sur la série
      validSeries.push(
        buildEnrichedSerie(serie, firstTrack, bestScore, previewUrl)
      );
    }
    // on lance le quizz
    initializeQuiz(validSeries);
  };

  // Affiche LoadingScreen si on charge un quiz
  if (dispLoadingScreen) {
    return <LoadingScreens />;
  }

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalTitle}>
          <Image
            src="/img/cloudy_moon.jpg"
            alt="Cloudy Moon"
            width={707}
            height={194}
            priority
          />
          <h1 className={styles.titlePage}>Blindtest</h1>
        </div>
        <div className={styles.modalTxt}>
          <button
            className="button-bulle pink"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 10,
            }}
            onClick={handleLeaveBuilding}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h2 className={styles.subtitle}>
            Bienvenue dans le Blindtest - série
          </h2>
          <p className={styles.instruction}>
            Dans ce bâtiment, vous allez pouvoir tester vos connaissances
            musicales sur les séries. Il vous sera possible d'écouter des
            extraits musicaux de séries choisis aléatoirement. Vous enchaînerez
            5 questions. Vous aurez la possibilité de demander un indice sur le
            nom de l'acteur principal ou bien sur l'affiche de la série.
          </p>
          <p className={styles.instruction}>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ width: "20px", height: "20px" }}
            />{" "}
            ATTENTION : en demandant un indice, vous gagnerez moins de points.
          </p>
          <hr className={styles.separator} />
          <ul className={styles.bodyTxt}>
            <p className={styles.subtitle}>Calcul des points :</p>
            <li>
              Pas d'indice révélé :{" "}
              <span className={styles.pointCpt}> III </span> points
            </li>
            <li>
              Un indice révélé : <span className={styles.pointCpt}> II </span>{" "}
              points
            </li>
            <li>
              Deux indices révélés :<span className={styles.pointCpt}> I </span>{" "}
              point
            </li>
            <li>
              Mauvaise réponse : <span className={styles.pointCpt}> 0 </span>{" "}
              point
            </li>
          </ul>

          <button onClick={handleStartQuiz} className={"form-button primary"}>
            Lancer le quiz
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </>
  );
}
