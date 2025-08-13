import { useRef, useState } from "react";
import styles from "../../assets/scss/blindtest/CorrectionElement.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function CorrectionElement({
  index,
  previewUrl,
  totalQuestion,
  questionNbr,
  serieName,
  userAnswer,
  isCorrect,
  playingIndex,
  onPlay,
  onStop,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!userAnswer) userAnswer = "Vous n'avez pas répondu à la question";

  const handlePlay = () => {
    if (audioRef.current) {
      setIsPlaying(true);
      onPlay(index); // informe le parent que cet audio joue
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.3;
      audioRef.current.play();

      setTimeout(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        onStop(); // informe le parent que l'audio est arrêté
      }, 5000);
    }
  };

  // Si un autre audio joue, on bloque le bouton
  const disabled =
    isPlaying || (playingIndex !== null && playingIndex !== index);

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
          disabled={disabled}
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
