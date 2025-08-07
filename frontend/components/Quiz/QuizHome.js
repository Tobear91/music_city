import { useState } from 'react';
import styles from "../../assets/scss/quiz/QuizHome.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Quiz from './Quiz';
import QuizPlaylists from './QuizPlaylists'
import Image from "next/image"

export default function QuizHome() {

  const [startQuiz, setStartQuiz] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false)
  
  const handlePlaylistQuiz = () => {
    setShowPlaylists(true);
  };

  // Quand on clique sur "Morceaux aléatoire favoris"
  const handleStartQuiz = () => {
    setStartQuiz(true);
  };

  
  if (showPlaylists) return <QuizPlaylists />;
  
  if (startQuiz) return <Quiz />;
  

  return (
    <>
      {!startQuiz ? (
        <div className={styles.quizHome}>
          
          <div className={styles.quizLeft}>
            <Image src="/img/cloudy_moon.jpg" alt="Cloudy Moon" width={707} height={194} priority />
            <h1 className={styles.quizTitle}>QUIZ</h1>
          </div>

          <div className={styles.quizRight}>
            <h2 className={styles.welcomeTitle}>Bienvenue sur le Quiz de Music City</h2>
            <p className={styles.description}>
              Dans ce bâtiment vous allez pouvoir tester vos connaissances musicales sur un quiz de 10 questions parmi deux choix :
            </p>
            <ul className={styles.descriptionList}>
              <li>Vos playlists que vous possédez sur votre compte Spotify</li>
              <li>Parmi une playlist aléatoire</li>
            </ul>
            <h3 className={styles.chooseTitle}>Choisissez votre Quiz</h3>

            <div className={styles.buttonContainer}>
              <button className={styles.quizButton} onClick={handlePlaylistQuiz}>
                En fonction d'une de mes playlists
                <FontAwesomeIcon icon={faArrowRight} style={{ color: '#fb6ca2' }} />
              </button>
              <button className={styles.quizButton} onClick={handleStartQuiz}>
                Morceaux aléatoire favoris
                <FontAwesomeIcon icon={faArrowRight} style={{ color: '#fb6ca2' }} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Quiz />
      )}
    </>
  );
} 