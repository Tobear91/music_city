import React from 'react';
import styles from './QuizHome.module.css';
import { FaBars, FaTimes } from 'react-icons/fa';

const QuizHome = () => {
  return (
    <div className={styles.quizHome}>
      {/* Partie gauche */}
      <div className={styles.quizLeft}>
        <FaBars className={styles.menuIcon} />
        <h1 className={styles.quizTitle}>QUIZ</h1>
      </div>

      {/* Partie droite */}
      <div className={styles.quizRight}>
        <FaTimes className={styles.closeIcon} />
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
          <button className={styles.quizButton}>
            En fonction d'une de mes playlists <span className={styles.arrow}>→</span>
          </button>
          <button className={styles.quizButton}>
            Playlist aléatoire <span className={styles.arrow}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizHome;