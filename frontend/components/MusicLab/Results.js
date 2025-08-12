import styles from "../../styles/MusicLab/Results.module.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import Lyrics from "./Lyrics";
import Album from "./Album";
import Genres from "./Genres";
import Interpretation from "./Interpretation";
import Thematiques from "./Thematiques";
import Audiofeatures from "./Audiofeatures";
import Footer from "./Footer";
import {
  getInterpretationAndThemes,
  resetAnalyses,
  addALike,
  addADislike,
} from "../../reducers/analyses";
import { replaceLinesBreacksWithBr } from "../../modules/formatages";
import { store } from "../../modules/store";

function Results() {
  const dispatch = useDispatch();
  const router = useRouter();
  const audioRef = useRef(null);
  const storeData = useSelector((state) => state.analyses.value);
  const useremail = useSelector((state) => state.user.user.email);


  const [dejaFait, setDejafait] = useState(false);
  const [criteres, setCriteres] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const interpretation = storeData.interpretation_by_ai.interpretation;
  const themes = storeData.interpretation_by_ai.themes;
  let formatedlyrics = replaceLinesBreacksWithBr(storeData.lyrics.lyrics);

  async function interpretationFunction(lyrics, artiste) {
    if (lyrics === "") {
      alert("No lyrics found for this track");
      return;
    }
    const data = await fetch(
      `http://127.0.0.1:3000/tracks/lyrics/interpretation?paroles=${encodeURIComponent(
        lyrics
      )}&artiste=${artiste}`
    );
    const res = await data.json();
    //ATTENTION : le backend renvoie un objet avec une clé "interpretation" contenant l'interprétation et les thématiques

    fetch(`http://127.0.0.1:3000/tracks/updateanalyse`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        track_id: storeData.track_id,
        interpretation: res.interpretation.interpretation,
        thematiques: res.interpretation.themes,
      }),
    });

    dispatch(getInterpretationAndThemes(res));
  }

  useEffect(() => {
    const tracksIdFromAlbum = storeData.album.tracks.map((track) => track.id);
    console.log(typeof storeData.duration_ms);
    fetch("http://127.0.0.1:3000/tracks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: storeData.lyrics.title,
        track_id: storeData.track_id,
        uri: storeData.uri,
        artist: storeData.lyrics.artist,
        genres: storeData.genres,
        lyrics: storeData.lyrics.lyrics,
        album: storeData.album.name,
        duration_ms: storeData.duration_ms,
        album_image: storeData.album.image,
        release_date: storeData.release_date,
        preview_url: storeData.preview_url,
      }),
    }).then((response) => response.json());

    fetch(`http://127.0.0.1:3000/tracks/updateanalyse`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        track_id: storeData.track_id,
        interpretation: interpretation,
        thematiques: themes,
      }),
    }).then((response) => response.json());

    fetch(`http://127.0.0.1:3000/users/avisInterpretations?email=${useremail}`)
      .then((response) => response.json())
      .then((data) => {
        if (
          data.some((database_id) => {
            return database_id === storeData.track_id;
          })
        ) {
          setDejafait(true);
        } else {
          setDejafait(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  function saveCritere(newcritere) {
    setCriteres((prev) => [...prev, newcritere]);
  }

  function handleLike() {
    fetch("http://127.0.1:3000/tracks/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        track_id: storeData.track_id,
        email: useremail,
      }),
    });
    setDejafait(true);
  }

  function handleDislike() {
    fetch("http://127.0.1:3000/tracks/dislike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        track_id: storeData.track_id,
        email: useremail,
      }),
    });
    setDejafait(true);
  }

  return (
    <>
      {/* HEADER */}
      <header className={styles.headerContainer}>
        <Header />
      </header>
      <div className={styles.resultsContainer}>
        {/* LYRICS */}
        <section className={styles.lyricsContainer}>
          <Lyrics
            title={storeData.lyrics.title}
            id={storeData.track_id}
            artist={storeData.lyrics.artist}
            lyrics={formatedlyrics}
            uri={storeData.uri}
            email={useremail}
            playpreview={playPreview}
            globalIsPlaying={isPlaying}
          />
        </section>

        {/* ALBUM */}
        <section className={styles.albumContainer}>
          <Album playpreview={playPreview} isPlaying={isPlaying} />
        </section>

        {/* INTERPRETATION */}
        <section className={styles.interpretationContainer}>
          <Interpretation
            track_id={storeData.track_id}
            databaseid={storeData.track_id}
            launchInterpretation={() =>
              interpretationFunction(
                storeData.lyrics.lyrics,
                storeData.lyrics.artist
              )
            }
            handleLike={() => handleLike()}
            handleDislike={() => handleDislike()}
            email={useremail}
            dejafait={dejaFait}
          />
        </section>

        {/* THEMES */}
        <section className={styles.themesContainer}>
          <Thematiques />
        </section>

        {/* GENRES */}
        <section className={styles.genresContainer}>
          <Genres genres={storeData.genres} function={saveCritere} />
        </section>

        {/* FOOTER */}
        <footer className={styles.footerContainer}>
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default Results;
