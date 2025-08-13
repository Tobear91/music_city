import styles from "../../styles/MusicLab/Lyrics.module.css";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { addToFavorites, getFavorites } from "../../modules/listedefavoris";
import { getPreviewWithArtistAndTitle } from "../../modules/getpreviewspotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

function Lyrics(props) {
  const audioRef = useRef(null); //modif useRef ne declenche pas de rerender
  const storeData = useSelector((state) => state.analyses.value);

  const [isFav, setIsFav] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (props.globalIsPlaying === false) {
      setIsPlaying(false);
    }
    async function fetchFavorites() {
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
  }, [props.globalIsPlaying]);

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
                  props.playpreview(previewUrl);
                  setIsPlaying(true);
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
