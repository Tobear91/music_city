import styles from "../../styles/MusicLab/Track.module.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { replaceMsWithMinutesAndSeconds } from "../../modules/formatages";
import { addToFavorites, getFavorites } from "../../modules/listedefavoris";
import { getPreviewWithArtistAndTitle } from "../../modules/getpreviewspotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlus,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

function Track(props) {
  const audioRef = useRef(null); //pour lecture preview *pourquoi useRef?

  const [isFav, setIsFav] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const useremail = useSelector((state) => state.user.user.email);
  const storeData = useSelector((state) => state.analyses.value);
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

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.error("Erreur lors de la lecture :", err));
  };

  useEffect(() => {
    async function fetchFavorites() {
      //creation de fonction async dans le scope du useEffect car useEffect ne peux pas l'etre (j'ai été tznté de faire un const data = await fetchfavorite)
      const data = await getFavorites(useremail);
      if (data && data.favorites) {
        const bool = data.favorites.some(
          (e) => e.track_spotify_id === storeData.album.tracks[props.index].id
        );
        setIsFav(bool);
      }
    }
    fetchFavorites();
    async function fetchPreview() {
    const preview = await getPreviewWithArtistAndTitle(
        storeData.album.tracks[props.index].name,
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
      <div key={props.index}>
        <p className={styles.titleRow}>
          <div className={styles.title}>
            {storeData.album.tracks[props.index].track_number} -{" "}
            {storeData.album.tracks[props.index].name} :{" "}
            {replaceMsWithMinutesAndSeconds(
              storeData.album.tracks[props.index].duration_ms
            )}{" "}
          </div>
          <div className={styles.buttons}>
            <button
              className="button-square small"
              style={{ backgroundColor: isFav ? "pink" : "purple" }}
              onClick={() => {
                addToFavorites(
                  storeData.album.tracks[props.index].id,
                  useremail,
                  storeData.album.tracks[props.index].name,
                  storeData.lyrics.artist,
                  storeData.album.tracks[props.index].uri
                );
                setIsFav(!isFav);
              }}
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
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
                  playPreview(previewUrl)
                // }

              }}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
          </div>
        </p>
      </div>
    </div>
  );
}

export default Track;
