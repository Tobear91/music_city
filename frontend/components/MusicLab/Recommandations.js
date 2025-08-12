import styles from "../../styles/MusicLab/Recommandations.module.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";

import { store } from "../../modules/store";

import { replaceMsWithMinutesAndSeconds } from "../../modules/formatages";
import { addToFavorites, getFavorites } from "../../modules/listedefavoris";
import { getPreviewWithArtistAndTitle } from "../../modules/getpreviewspotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

function Recommandations() {
  const dispatch = useDispatch();
  const router = useRouter();
  const audioRef = useRef(null); //pour lecture preview *pourquoi useRef?

  const storeRecommandations = useSelector(
    (state) => state.recommandations.value.tracks
  );

  const useremail = useSelector((state) => state.user.user.email);
  const criteres = useSelector((state) => state.criteres.value.criteres)

  const [isFav, setIsFav] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Récupérer les favoris de l'utilisateur
        const data = await getFavorites(useremail);
        if (data && data.favorites) {
          // Initialiser l'état isFav par track_id
          const favs = {};
          data.favorites.forEach((e) => {
            favs[e.track_spotify_id] = true;
          });
          setIsFav(favs);
        }

        // Précharger les previews pour chaque track des recommandations
        const previews = {};
        for (const track of storeRecommandations) {
          const preview = await getPreviewWithArtistAndTitle(
            track.title,
            track.artist
          );
          if (preview) {
            previews[track.track_id] = preview;
          }
        }
        setPreviewUrl(previews); // ici previewUrl devient un objet { track_id: previewUrl }
      } catch (err) {
        console.error("Erreur dans fetchData :", err);
      }
    }

    fetchData();
  }, [useremail, storeRecommandations]);

  const recommandationsList = storeRecommandations.map((track, index) => {
    return (
      <div key={index} style={{ marginBottom: "12px" }}>
        <div className={styles.titleRow}>
          <div className={styles.title}>
            {track.title} - {track.artist} : {replaceMsWithMinutesAndSeconds(track.duration_ms)}
          </div>
          <div className={styles.buttons}>
            <button
              className="button-square small"
              style={{
                backgroundColor: isFav[track.track_id] ? "pink" : "purple",
              }}
              onClick={() => {
                addToFavorites(
                  track.track_id,
                  useremail,
                  track.title,
                  track.artist
                );
                setIsFav((prev) => ({
                  ...prev,
                  [track.track_id]: !prev[track.track_id],
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
                playPreview(previewUrl[track.track_id]);
              }}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
          </div>
        </div>
      </div>
    );
  });

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

  console.log(criteres)
  return (
    <div className={styles.resultsContainer}>
      <header className={styles.headerContainer}>
        <Header />
      </header>
      <div className={styles.titleContainer}><h1>{criteres.join(' / ')}</h1></div>
      <div className={styles.recommandationsContainer}>
        <section>{recommandationsList}</section>
      </div>
    </div>
  );
}

export default Recommandations;
