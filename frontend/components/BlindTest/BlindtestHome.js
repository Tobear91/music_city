import React from 'react';
import styles from '../../styles/BlindTest/BlindtestHome.module.css'
import Questions from './Questions';
import { useState } from 'react';
export default function BlindtestHome ({onClose}){

    const [showQuiz, setShowQuiz] = useState(false);    
    
    return (
        <>
    
{!showQuiz ? (
  <div className={styles.modalOverlay}>
    <div className={styles.modalTitle}>
      <h1>Blind Test</h1>
    </div>
    <div className={styles.modalTxt}>
      <h2>Bienvenue dans le BlindTest!</h2>
      <p>
        Dans ce bâtiment, vous allez pouvoir tester vos connaissances musicales sur les séries.
        Vous allez entamer un blind test de 5 questions.
      </p>
      <ul>
        <li>Choisissez ou non les genres sur lesquels vous voulez être interrogés</li>
        <li>Choisissez ou non la période</li>
      </ul>
      <button onClick={onClose}>Fermer</button>
      <button onClick={() => setShowQuiz(true)}>Lancer le Quizz</button>
    </div>
    </div>
) : (
  <Questions />
)}

    </>
    )
}