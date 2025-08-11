import styles from "../../styles/MusicLab/Lyrics.module.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, getFavorites } from "../../modules/listedefavoris";
import { getPreviewWithArtistAndTitle } from "../../modules/getpreviewspotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlus,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

function Lyrics(props) {
  const audioRef = useRef(null); //pour lecture preview *pourquoi useRef?

  const storeData = useSelector((state) => state.analyses.value);

  const [isFav, setIsFav] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");


const playPreview = (url) => {
  if (isPlaying) {
    // Mettre en pause si déjà en train de jouer
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    return;
  }

  // Sinon lancer la lecture
  if (audioRef.current) {
    audioRef.current.pause();
  }

  audioRef.current = new Audio(url);
  audioRef.current.volume = 0.3;

  audioRef.current.play()
    .then(() => setIsPlaying(true))
    .catch((err) => console.error("Erreur lors de la lecture :", err));
};

  useEffect(() => {
    async function fetchFavorites() {
      //creation de fonction async dans le scope du useEffect car useEffect ne peux pas l'etre (j'ai été tznté de faire un const data = await fetchfavorite)
      const data = await getFavorites(props.email);
      if (data && data.favorites) {
        const bool = data.favorites.some(
          (e) => e.track_spotify_id === props.id
        );
        setIsFav(bool);
      }
    }

    fetchFavorites();
    async function fetchPreview() {
    const preview = await getPreviewWithArtistAndTitle(
        storeData.lyrics.title,
        storeData.lyrics.artist
      );
      if (preview) {
        setPreviewUrl(preview);
      }
    }
    fetchPreview();
  }, []);

  return (
    <div>
      <div>
        <p className={styles.titleRow}>
          <span className={styles.title}>
            {props.title} - {props.artist}
          </span>
          <div className={styles.buttons}>
            <button
              className="button-square small"
              style={{ backgroundColor: isFav ? "pink" : "purple" }}
              onClick={() => {
                addToFavorites(props.id, props.email);
                setIsFav(!isFav);
              }}
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <div>
              <audio ref={audioRef} src={previewUrl} preload="auto" />
              <button
                className="button-square small"
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => {
                  // if(isPremium){
                  //   playFullMusic(uri)
                  //   console.log("play the music")
                  // } else {
                  //   console.log("play the preview")
                  playPreview(previewUrl);
                  // }
                }}
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
            </div>
          </div>
        </p>
      </div>
      <div>
        <p>{props.lyrics}</p>
      </div>
    </div>
  );
}

export default Lyrics;
