import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/blindtest/Results.module.scss";
import { checkCorrection } from "../../modules/checkCorrection";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { leaveApplication } from "../../modules/appinteraction";
import Image from "next/image";
import Header from "./Header";

export default function Results() {
  const router = useRouter();

  const blindtestInfo = useSelector((state) => state.blindtest);

  const handleRestart = () => {
    router.push("/blindtest-serie");
  };

  const handleWatchCorrection = () => {
    router.push("/blindtest-serie/correction");
  };

  const handleLeaveBuilding = () => {
    leaveApplication(router);
  };

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
          <div className={styles.container}>
            <h1 className={styles.title}> Félicitation ! </h1>
            <p className={styles.subtitle}>
              {" "}
              Votre score est : {blindtestInfo.score}/
              {blindtestInfo.questionList.length * 3}{" "}
            </p>
            <p className={styles.subtitle}> Votre niveau est ... </p>
          </div>
          <div className={styles.buttonTriple}>
            <button className={styles.button} onClick={handleWatchCorrection}>
              Voir la correction{" "}
              <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} />
            </button>

            <button className={styles.button} onClick={handleRestart}>
              Relancer le quizz{" "}
              <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} />
            </button>
            <button className={styles.button} onClick={handleLeaveBuilding}>
              Sortir du batiment{" "}
              <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
