import styles from "../../styles/MusicLab/Track.module.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { replaceMsWithMinutesAndSeconds } from "../../modules/formatages";
import { removeFromFavorites } from "../../modules/listedefavoris";
import { getPreviewWithArtistAndTitle } from "../../modules/getpreviewspotify";
import { removeAFavoriteFromStore } from "../../reducers/favoris";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faTrash } from "@fortawesome/free-solid-svg-icons";

function TrackFav(props) {
  const dispatch = useDispatch();

  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    //va chercher l'url de la preview
    async function fetchPreview() {
      const preview = await getPreviewWithArtistAndTitle(
        props.title,
        props.artist
      );
      console.log(preview);
      if (preview) {
        setPreviewUrl(preview);
      }
    }
    fetchPreview();
  }, [props.isplaying]);

  return (
    <div key={props.key} style={{ marginBottom: "12px" }}>
      <div className={styles.titleRow}>
        <div className={styles.title}>
          {props.title} - {props.artist} :{" "}
          {replaceMsWithMinutesAndSeconds(props.duration_ms)}
        </div>
        <div className={styles.buttons}>
          <button
            className="button-square small"
            style={{
              backgroundColor: "red",
            }}
            onClick={() => {
              removeFromFavorites(props.track_id, props.useremail);
              props.setisplaying(false);
              dispatch(removeAFavoriteFromStore(props.track_id));
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
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
              props.playpreview(previewUrl);
            }}
          >
            <FontAwesomeIcon icon={props.isplaying ? faPause : faPlay} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrackFav;
