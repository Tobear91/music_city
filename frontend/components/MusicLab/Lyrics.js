import styles from "../../styles/MusicLab/Lyrics.module.css";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { addToFavorites, getFavorites } from "../../modules/listedefavoris";
import { getPreviewWithArtistAndTitle } from "../../modules/getpreviewspotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { store } from "../../modules/store";

function Lyrics(props) {
  const audioRef = useRef(null); //modif useRef ne declenche pas de rerender
  const storeData = useSelector((state) => state.analyses.value);

  const [isFav, setIsFav] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    //recupere la liste des favoris dans la bdd
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

  }, [props.storefavoris, storeData]);

  useEffect(() => {
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
  }, [storeData]);

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
                addToFavorites(
                  storeData.track_id,
                  props.email,
                  storeData.lyrics.title,
                  storeData.lyrics.artist,
                  storeData.uri,
                  storeData.duration_ms
                );
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
                  props.setisplaying(!props.isplaying);
                }}
              >
                <FontAwesomeIcon icon={props.isplaying ? faPause : faPlay} />
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
