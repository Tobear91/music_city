import styles from "../../styles/MusicLab/Track.module.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { replaceMsWithMinutesAndSeconds } from "../../modules/formatages";
import { addToFavorites, getFavorites } from "../../modules/listedefavoris";
import { getPreviewWithArtistAndTitle } from "../../modules/getpreviewspotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

function Track(props) {
  const [isFav, setIsFav] = useState(false);

  const useremail = useSelector((state) => state.user.user.email);
  const storeData = useSelector((state) => state.analyses.value);
  const storeFavoris = useSelector((state) => state.favoris.value.tracks);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    //recupere la liste des favoris dans la bdd

        const bool = storeFavoris.some(
          (e) => e.track_id === storeData.album.tracks[props.index].id
        );
        setIsFav(bool);
      
    
  }, [storeFavoris]);

  useEffect(() => {
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
                  storeData.album.tracks[props.index].uri,
                  storeData.album.tracks[props.index].duration_ms
                );
                setIsFav(!isFav);
                console.log(storeData.album.tracks[props.index].id)
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
                props.setisplaying(!props.isplaying);
              }}
            >
              <FontAwesomeIcon icon={props.isplaying ? faPause : faPlay} />
            </button>
          </div>
        </p>
      </div>
    </div>
  );
}

export default Track;
