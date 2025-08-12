import React, { useEffect } from "react";
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
import { getSoundtrackScore } from "../../modules/checkKeyWords";
import { getAlbum, getFirstTrackAlbum } from "../../modules/spotify";
import { useRouter } from "next/router";
import { leaveApplication } from "../../modules/appinteraction";

export default function Home() {
  const [dispLoadingScreen, setDispLoadingScreen] = useState(false);
  const dispatch = useDispatch();
  const validSeries = [];
  const router = useRouter();

  const initializeQuiz = () => {
    dispatch(addQuestionListToStore(validSeries));
    router.push("./blindtest-serie/questions");
  };

  const handleLeaveBuilding = () => {
    leaveApplication(router);
  };

  // test de page de chargement pendant 1 secondes
  const handleStartQuiz = async () => {
    setDispLoadingScreen(true);
    let data = await fetch("http://127.0.0.1:3000/blindtest/randomshow");
    data = await data.json();

    const requiredCount = 5; // Nombre de séries valides minimum
    const maxSeries = data.series.length;

    for (
      let i = 0;
      i < data.series.length &&
      validSeries.length < requiredCount &&
      i < maxSeries;
      i++
    ) {
      const title = data.series[i].title;
      const platform = data.series[i].platform;
      const query = `${title} soundtrack`;
      let albums = await getAlbum(query);

      let bestAlbum = null;
      let bestScore = -1;

      for (let album of albums.albums.items) {
        const score = await getSoundtrackScore(album.name, title, platform);
        if (score > bestScore) {
          bestScore = score;
          bestAlbum = album;
        }
      }
      if (!bestAlbum) continue;

      const firstTrack = await getFirstTrackAlbum(bestAlbum.id);
      if (!firstTrack || !firstTrack.trackId) continue;

      const response = await fetch(
        "http://127.0.0.1:3000/blindtest/previewUrl",
        {
          method: "POST",
          body: JSON.stringify({
            artistName: firstTrack.artistName,
            trackName: firstTrack.trackName,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) continue;

      const dataSpotifyPreview = await response.json();
      if (!dataSpotifyPreview.previewUrl) continue;

      // Construire la série enrichie
      const enrichedSerie = {
        ...data.series[i],
        artistName: firstTrack.artistName,
        soundtrack: firstTrack.trackName,
        trackId: firstTrack.trackId,
        isTrackMatchCertain: bestScore > 25,
        previewURL: dataSpotifyPreview.previewUrl,
      };

      validSeries.push(enrichedSerie);
    }

    setDispLoadingScreen(false);
    initializeQuiz();
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
          <h1 className={styles.titlePage}>Blind Test</h1>
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
          <h2 className={styles.subtitle}>Bienvenue dans le BlindTest</h2>
          <p className={styles.instruction}>
            Dans ce bâtiment, vous allez pouvoir tester vos connaissances
            musicales sur les séries. Il vous sera possible d'écouter des
            extraits musicaux de série choisis aléatoirement. Vous enchaînerez 5
            question. Vous aurez la possibilité de demander un indice sur le nom
            de l'acteur principal ou bien l'affiche de la série.
          </p>
          <p className={styles.instruction}>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ width: "20px", height: "20px" }}
            />{" "}
            ATTENTION : en demandant un indice vous gagnerez moins de points.
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
            Démarrer le quiz
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </>
  );
}
