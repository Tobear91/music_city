import React, { useRef,useState } from 'react';
import styles from "../../assets/scss/blindtest/QuestionElement.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay} from "@fortawesome/free-solid-svg-icons";


export default function QuestionElement({previewUrl,totalQuestion,questioNumber}){
    
    const audioRef = useRef(null);
    let timeoutId = null;
    const [isPlaying, setIsPlaying] = useState(false); // me permet d'empêcher l'utilisateur de relciquer sue le bouton pendant l'coyte
  

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
  
                <h2 className={styles.subtitle}> Question {questioNumber}/ {totalQuestion} </h2>
                <p> De quel série provient cet extrait musicale ?</p>             
            </div>

                <div className={styles.listenButton}>
                <audio ref={audioRef} src={previewUrl} preload="auto" />
                <button onClick={handlePlay} className="form-button primary" disabled={isPlaying}>
                    {isPlaying ? "Lecture en cours..." : (
                    <>
                        Écouter un extrait <FontAwesomeIcon icon={faPlay} />
                    </>
                    )}
                </button>
            </div>
        </div>
    )
}