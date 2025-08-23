import styles from "../../styles/MusicLab/Track.module.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { replaceMsWithMinutesAndSeconds } from "../../modules/formatages";
import { addToFavorites, getFavorites } from "../../modules/listedefavoris";
import { getPreviewWithArtistAndTitle } from "../../modules/getpreviewspotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

function TrackReco(props) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [isFav, setIsFav] = useState(false);
  const storeFavoris = useSelector((state) => state.favoris.value.tracks);

  useEffect(() => {
    //set isfav selon la liste des favoris dans le store
        const bool = storeFavoris.some(
          (e) => e.track_id === props.track_id
        );
        setIsFav(bool);
      
  }, [storeFavoris]);

  useEffect(() => {
    //recupere le preview avec spotifyPreviewFinder
    async function fetchPreview() {
      const preview = await getPreviewWithArtistAndTitle(
        props.title,
        props.artist
      );
      if (preview) {
        setPreviewUrl(preview);
      }
    }
    fetchPreview();
  }, [])

  
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
              backgroundColor: isFav ? "pink" : "purple",
            }}
            onClick={() => {
              //ajoute aux favoris dans bdd
              addToFavorites(
                props.track_id,
                props.useremail,
                props.title,
                props.artist
              );
              //switch d'état pour changer la couleur du bouton
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
