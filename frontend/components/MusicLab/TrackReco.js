import styles from "../../styles/MusicLab/Track.module.css";
import { useState, useEffect, useRef } from "react";
import { replaceMsWithMinutesAndSeconds } from "../../modules/formatages";
import { addToFavorites, getFavorites } from "../../modules/listedefavoris";
import { getPreviewWithArtistAndTitle } from "../../modules/getpreviewspotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

function TrackReco(props) {
  const [previewUrl, setPreviewUrl] = useState("");


  useEffect(() => {
    if(props.isplaying === false){
      props.setisplaying(false)
    }

    async function fetchPreview() {
    const preview = await getPreviewWithArtistAndTitle(
        props.title,
        props.artist
      );
      console.log(preview)
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
                backgroundColor: props.isfav[props.track_id] ? "pink" : "purple",
              }}
              onClick={() => {
                addToFavorites(
                  props.track_id,
                  props.useremail,
                  props.title,
                  props.artist
                );
                props.setisfav((prev) => ({
                  ...prev,
                  [props.track_id]: !prev[props.track_id],
                }));
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

export default TrackReco;