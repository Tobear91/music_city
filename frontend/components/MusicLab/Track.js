import styles from "../../styles/MusicLab/Track.module.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { replaceMsWithMinutesAndSeconds } from "../../modules/formatages";
import { addToFavorites, getFavorites } from "../../modules/listedefavoris";
import { getPreviewWithArtistAndTitle } from "../../modules/getpreviewspotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
 
function Track(props) {
  const [isFav, setIsFav] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const useremail = useSelector((state) => state.user.user.email);
  const storeData = useSelector((state) => state.analyses.value);
  const [previewUrl, setPreviewUrl] = useState("");


  useEffect(() => {
    if(props.globalIsPlaying === false){
      setIsPlaying(false)
    }
    async function fetchFavorites() {
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
  }, [props.globalIsPlaying]);

  return (
    <div>
      <div key={props.index} >
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
                  storeData.album.tracks[props.index].uri,
                  storeData.album.tracks[props.index].duration_ms
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
                    props.playpreview(previewUrl)
                    setIsPlaying(true)
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
