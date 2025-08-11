import React, { useRef,useState } from 'react';
import styles from "../../assets/scss/blindtest/CorrectionElement.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay} from "@fortawesome/free-solid-svg-icons";


export default function CorrectionElement({previewUrl,totalQuestion,questionNbr,serieName, userAnswer}){
    
    const audioRef = useRef(null);
    let timeoutId = null;
    const [isPlaying, setIsPlaying] = useState(false); // me permet d'empêcher l'utilisateur de relciquer sue le bouton pendant l'coyte
  
    if (!userAnswer){
        userAnswer = "Vous n'avez pas répondu à la question"
    }
  const handlePlay = () => {
    const audio = audioRef.current;
    if (audio) {
        setIsPlaying(true);
      audio.currentTime = 0;   
      audio.volume = 0.3;   
      audio.play();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false); 
      }, 5000); //arret de al musique au bout de 5s ec
    }
  };

    return(
        <div className={styles.question}>
            <div className={styles.questionTxt}>
  
                <h2 className={styles.subtitle}> Question {questionNbr}/ {totalQuestion}   
                </h2>
                <p className={styles.text}>
                    Nom de la série : {serieName}
                </p>
                <p className={styles.text}>
                    Votre réponse : {userAnswer}
                </p>
            </div>

                <div className={styles.listenButton}>
                <audio ref={audioRef} src={previewUrl} preload="auto" />
                <button onClick={handlePlay} className="form-button primary" disabled={isPlaying}>
                    {isPlaying ? "Lecture en cours..." : (
                    <>
                        Reécouter l'extrait <FontAwesomeIcon icon={faPlay} />
                    </>
                    )}
                </button>
            </div>
        </div>
    )
}