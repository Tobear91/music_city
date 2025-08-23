import styles from "../../styles/MusicLab/RecommandationsFavoris.module.css";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import TrackReco from "./TrackReco";
import { store } from "../../modules/store";
import { getFavorites } from "../../modules/listedefavoris";
import { getFavoritesListInStore } from "../../reducers/favoris";
function Recommandations() {
  const dispatch = useDispatch();
  const router = useRouter();
  const audioRef = useRef(null); //pour lecture preview *pourquoi useRef?

  const storeRecommandations = useSelector(
    (state) => state.recommandations.value.tracks
  );

  const storeFavoris = useSelector((state) => state.favoris.value.tracks);
  const useremail = useSelector((state) => state.user.user.email);
  const criteres = useSelector((state) => state.criteres.value.criteres);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying === false) {
      setIsPlaying(false);
    }
    //va chercher les favoris dans la DB et met à jour le store
    async function fetchFavorites() {
      const data = await getFavorites(useremail);
      if (data.result === true) {
        dispatch(getFavoritesListInStore(data.favorites));
      }
    }
    fetchFavorites();
  }, []);

  //fonction de lecture d'audio à partir d'une url
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

  //arrete la lecture et navigue vers la page results
  function handleClickAnalyse() {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    router.push("/music-lab/results");
  }

  //arrete la lecture et navigue vers la page favoris
  function handleClickFavoris() {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    router.push("/music-lab/favoris");
  }

  const recommandationsList = storeRecommandations.map((track, index) => {
    return (
      <TrackReco
        key={index}
        track_id={track.track_id}
        title={track.title}
        artist={track.artist}
        duration_ms={track.duration_ms}
        playpreview={playPreview}
        useremail={useremail}
        isplaying={isPlaying}
        setisplaying={setIsPlaying}
        storefavoris={storeFavoris}
      />
    );
  });

  return (
    <div className={styles.resultsContainer}>
      <header className={styles.headerContainer}>
        <Header />
      </header>
      <div className={styles.titleContainer}>
        <h1 style={{ color: "#2e1b5c" }}>{criteres.join(" / ")}</h1>
      </div>
      <div className={styles.tracksContainer}>
        <section>{recommandationsList}</section>
      </div>
      <footer className={styles.footerContainer}>
        <div className={styles.button}>
          <button
            className={"form-button primary"}
            style={{ width: 600, height: 35 }}
            onClick={() => handleClickAnalyse()}
          >
            ANALYSE
          </button>
        </div>
        <div className={styles.button}>
          <button
            className={"form-button primary"}
            style={{ width: 600, height: 35 }}
            onClick={() => handleClickFavoris()}
          >
            FAVORIS
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Recommandations;
