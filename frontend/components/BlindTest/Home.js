import React, { useEffect } from 'react';
import styles from "../../assets/scss/blindtest/Home.module.scss";
import Questions from './Questions';
import LoadingScreens from './LoadingScreens';
import { useState } from 'react';
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleXmark,faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useSelectorn,useDispatch } from "react-redux";
import { closeModal,addQuestionListToStore, openModal,resetQuiz } from "../../reducers/blindtest";
import { getSoundtrackScore } from '../../modules/checkKeyWords';
import {getAlbum,getFirstTrackAlbum} from '../../modules/spotify'

export default function Home (){
  const [showQuiz, setShowQuiz] = useState(false);   
  const [dispLoadingScreen, setDispLoadingScreen] = useState(false);
  const dispatch = useDispatch()
  
  let listQuestion = [];


    const initializeQuiz = () => {
  dispatch(addQuestionListToStore(listQuestion));
  setShowQuiz(true)
};



  const handleCloseModal = ()=>{
      dispatch(closeModal())
    }

  // test de page de chargement pendant 1 secondes
  const handleStartQuiz = async () => {


    setDispLoadingScreen(true);
    let data = await fetch('http://127.0.0.1:3000/blindtest/randomshow');
    data = await data.json()
    
    for (let i=0; i<data.series.length;i++){
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
          const firsTrack = await getFirstTrackAlbum(bestAlbum.id);

        data.series[i].artistName = firsTrack.artistName;
        data.series[i].soundtrack = firsTrack.trackName;
        data.series[i].trackId = firsTrack.trackId;
        data.series[i].spotifyAlbumName = bestAlbum.name;

        if (bestScore>25){
          data.series[i].isTrackMatchCertain = true;
        }


        const response = await fetch('http://127.0.0.1:3000/blindtest/previewUrl',{
          method: "POST",
            body: JSON.stringify({
            artistName: firsTrack.artistName,
            trackName: firsTrack.trackName,
      }),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
        })
        
        const dataSpotifyPreview = await response.json()

        data.series[i].previewURL = dataSpotifyPreview.previewUrl;
    }

    console.log(data.series) 

      
    listQuestion = data.series.map((serie)=>{
      return (
        {
          serieName:serie.title.split(':')[0],
          mainActor:serie.mainActor,
          posterUrl:serie.posterPath,
          previewURL:serie.previewURL,
          isTrackMatchCertain:serie.isTrackMatchCertain
        }
      )
    })
    setDispLoadingScreen(false)

    initializeQuiz();
 };

  const restartQuiz = () => {
  dispatch(resetQuiz());            
  setShowQuiz(false);             
  setDispLoadingScreen(false);

  };

    return (
    <>
      {dispLoadingScreen ? (
          <LoadingScreens></LoadingScreens>
      ) : showQuiz ? (
        <Questions restartQuiz={restartQuiz} />
      ) : (
        <div className={styles.modalOverlay}>
          <div className={styles.modalTitle}>
            <Image src="/img/cloudy_moon.jpg" alt="Cloudy Moon" width={707} height={194} priority />
            <h1 className={styles.titlePage}>Blind Test</h1>
          </div>
          <div className={styles.modalTxt}>
            <FontAwesomeIcon icon={faCircleXmark} className={styles.crossClose} style={{ width: "40px", height: "40px" }} onClick={handleCloseModal}/>
            <h2 className={styles.subtitle}>Bienvenue dans le BlindTest</h2>
            <p className={styles.instruction}>
              Dans ce bâtiment, vous allez pouvoir tester vos connaissances musicales sur les séries. Il vous sera possible d'écouter des extraits musicaux de série choisis aléatoirement. Vous enchaînerez 5 question. Vous aurez la possibilité de demander un indice sur le nom de l'acteur principal ou bien l'affiche de la série.
            </p>
            <p className={styles.instruction}> 
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ width: "20px", height: "20px" }}/> ATTENTION : en demandant un indice vous gagnerez moins de points.
            </p>
            <hr className={styles.separator} />
            <ul className={styles.bodyTxt}>
              <p className={styles.subtitle}>Calcul des points :</p>
              <li>Pas d'indice révélé : <span className={styles.pointCpt}> III </span> points</li>
              <li>Un indice révélé : <span className={styles.pointCpt}> II </span> points</li>
              <li>Deux indices révélés :<span className={styles.pointCpt}> I </span> point</li>
              <li>Mauvaise réponse : <span className={styles.pointCpt}> 0 </span> point</li>
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






