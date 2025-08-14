import styles from "../../styles/MusicLab/RecommandationsFavoris.module.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import TrackFav from "./TrackFav";
import { store } from "../../modules/store";

import { getFavorites } from "../../modules/listedefavoris";
import { getFavoritesListInStore } from "../../reducers/favoris";

function Favoris() {
  const dispatch = useDispatch();
  const router = useRouter();
  const audioRef = useRef(null); //pour lecture preview *pourquoi useRef?

  const storeFavoris = useSelector((state) => state.favoris.value.tracks);

  const useremail = useSelector((state) => state.user.user.email);
  const [isFav, setIsFav] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying === false) {
      setIsPlaying(false);
    }
    //va chercher les favoris dans la DB et met à jour le store
    async function fetchFavorites() {
      const data = await getFavorites(useremail);
      dispatch(getFavoritesListInStore(data.favorites));
      if (data && data.favorites) {
        const bool = data.favorites.some(
          (e) => e.track_spotify_id === storeFavoris.track_id
        );
        setIsFav(bool);
      }
    }
    fetchFavorites();
  }, [isPlaying]);

  console.log(favorisList);
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

  //arrete la lecture et navigue vers la page recommandations
  function handleClickRecommandations() {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    router.push("/music-lab/recommandations");
  }

  //genere la liste de tracks à partir du store redux Favoris
  const favorisList = storeFavoris.map((track, index) => (
    <TrackFav
      key={index}
      title={track.title}
      artist={track.artist}
      duration_ms={track.duration_ms}
      track_id={track.track_id}
      setisplaying={setIsPlaying}
      isplaying={isPlaying}
      playpreview={playPreview}
      useremail={useremail}
    />
  ));
  return (
    <div className={styles.resultsContainer}>
      <header className={styles.headerContainer}>
        <Header />
      </header>
      <div className={styles.titleContainer}>
        <h1 style={{ color: "#2e1b5c" }}>Liste de favoris</h1>
      </div>
      <div className={styles.tracksContainer}>
        <section>{favorisList}</section>
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
            onClick={() => handleClickRecommandations()}
          >
            RECOMMANDATIONS
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Favoris;
