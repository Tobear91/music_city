import React, { useEffect } from 'react';
import styles from "../../assets/scss/blindtest/Home.module.scss";
import Questions from './Questions';

import LoadingScreens from './LoadingScreens';

import { useState } from 'react';
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closeModal,addQuestionListToStore } from "../../reducers/blindtest";

export default function BlindtestHome (){
  const [showQuiz, setShowQuiz] = useState(false);   
  const [dispLoadingScreen, setDispLoadingScreen] = useState(false);
  const dispatch = useDispatch()
  

  const listQuestion = [
    {serieName: "Game Of Thrones",mainActor: "Peter Dinklage",posterUrl: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",previewURL:"https://p.scdn.co/mp3-preview/c790a8cdacbc2afe9d2e478edeace6cc90ad3eda"},
      {serieName: "Squid Game",mainActor:"Lee Jung-jae",posterUrl: "https://image.tmdb.org/t/p/w500/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg",previewURL:"https://p.scdn.co/mp3-preview/59f2a10febaacf3527b1306ede3f2baa3abd7af8"},
  ]
  useEffect(()=>{
    dispatch(addQuestionListToStore(listQuestion))
  },[])
  

  const handleCloseModal = ()=>{
      dispatch(closeModal())
    }

  // test de page de chargement pendant 1 secondes
  const handleStartQuiz = () => {
    setDispLoadingScreen(true);
    setTimeout(() => {
      setDispLoadingScreen(false);
      setShowQuiz(true);
    }, 1000); // 1 secondes
  };



    return (
    <>
      {dispLoadingScreen ? (
          <LoadingScreens></LoadingScreens>
      ) : showQuiz ? (
        <Questions />
      ) : (
        <div className={styles.modalOverlay}>
          <div className={styles.modalTitle}>
            <Image src="/img/cloudy_moon.jpg" alt="Cloudy Moon" width={707} height={194} priority />
            <h1 className={styles.titlePage}>Blind Test</h1>
          </div>
          <div className={styles.modalTxt}>
            <FontAwesomeIcon icon={faCircleXmark} className={styles.crossClose} style={{ width: "40px", height: "40px" }} onClick={handleCloseModal}/>
            <h2 className={styles.subtitle}>Bienvenue dans le BlindTest</h2>
            <p>
              Dans ce bâtiment, vous allez pouvoir tester vos connaissances musicales sur les séries.
              Vous allez entamer un blind test de 5 questions. Vous aurez la possibilité de demander un indice sur le nom de l'acteur principal ou bien un morceau de l'affiche du film. 
              Mais ATTENTION : en demandant un indice vous gagnerez moins de points.
            </p>
            <ul>
              <p>Calcul des points :</p>
              <li>Pas d'indice révélé : + 3 points</li>
              <li>Un indice révélé : + 2 points</li>
              <li>Deux indices révélés : + 1 point</li>
              <li>Mauvaise réponse : 0 point</li>
            </ul>
            <ul>
              <li>Choisissez ou non les genres sur lesquels vous voulez être interrogés</li>
              <li>Choisissez ou non la période</li>
            </ul>
            <button onClick={handleStartQuiz} className={"form-button primary"}>
              Démarrer le quiz
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}






