import { useRef } from "react";
import styles from "../../assets/scss/blindtest/CorrectionElement.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function CorrectionElement({
  previewUrl,
  totalQuestion,
  questionNbr,
  serieName,
  userAnswer,
  isCorrect,
  playingIndex,
  setPlayingIndex,
  index,
}) {
  const audioRef = useRef(null); // Référence vers l'élément audio
  let timeoutId = null; // ID du timer pour arrêter le son

  const isPlaying = playingIndex === index; // true si c'est cet extrait qui est en train de jouer

  // Si pas de réponse, texte par défaut
  if (!userAnswer) {
    userAnswer = "Vous n'avez pas répondu à la question";
  }

  const handlePlay = () => {
    // Bloque le lancement si un autre extrait joue déjà
    if (playingIndex !== null && playingIndex !== index) return;

    const audio = audioRef.current;
    if (audio) {
      setPlayingIndex(index); // Déclare cet extrait comme en cours
      audio.currentTime = 0; // Redémarre depuis le début
      audio.volume = 0.3;
      audio.play();

      clearTimeout(timeoutId); // Annule un ancien timer s'il existe
      timeoutId = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        setPlayingIndex(null); // Libère le "verrou"
      }, 5000); // Stoppe après 5 secondes
    }
  };

  return (
    <div className={styles.question}>
      <div className={styles.questionTxt}>
        <h2 className={styles.subtitle}>
          Question {questionNbr}/ {totalQuestion}
          {isCorrect ? (
            <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />
          ) : (
            <FontAwesomeIcon icon={faXmark} style={{ color: "red" }} />
          )}
        </h2>
        <p className={styles.text}>Nom de la série : {serieName}</p>
        <p className={styles.text}>Votre réponse : {userAnswer}</p>
      </div>

      <div className={styles.listenButton}>
        <audio ref={audioRef} src={previewUrl} preload="auto" />
        <button
          onClick={handlePlay}
          className="form-button primary"
          disabled={playingIndex !== null && playingIndex !== index} // ✅ désactive tous les autres
        >
          {isPlaying ? (
            "Lecture en cours..."
          ) : (
            <>
              Réécouter l'extrait <FontAwesomeIcon icon={faPlay} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
