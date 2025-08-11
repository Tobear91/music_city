import styles from "../../styles/MusicLab/Results.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import Lyrics from "./Lyrics";
import Album from "./Album";
import Genres from "./Genres";
import Interpretation from "./Interpretation";
import Thematiques from "./Thematiques";
import Audiofeatures from "./Audiofeatures";
import Recommandations from "./Recommandations";
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
  const storeData = useSelector((state) => state.analyses.value);
  const useremail = useSelector((state) => state.user.user.email);

  const [dejaFait, setDejafait] = useState(false);
  const [criteres, setCriteres] = useState([]);
  // const [likes, setLikes] = useState(0);
  // const [dislikes, setDislikes] = useState(0);

  const {
    track_id,
    artist_id,
    uri,
    lyrics,
    album,
    duration_ms,
    metadatas,
    genres,
  } = storeData;

  const interpretation = storeData.interpretation_by_ai.interpretation;
  const themes = storeData.interpretation_by_ai.themes;
  let formatedlyrics = replaceLinesBreacksWithBr(lyrics.lyrics);

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
        track_id: track_id,
        interpretation: res.interpretation.interpretation,
        thematiques: res.interpretation.themes,
      }),
    });

    dispatch(getInterpretationAndThemes(res));
  }

  useEffect(() => {
    const tracksIdFromAlbum = storeData.album.tracks.map((track) => track.id);
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
        album: tracksIdFromAlbum,
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
        track_id: track_id,
        interpretation: interpretation,
        thematiques: themes,
      }),
    }).then((response) => response.json());
    // fetch(`http://127.0.0.1:3000/tracks/like?track_id=${track_id}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setLikes(data.likes);
    //     setDislikes(data.dislikes);
    //   });
    fetch(`http://127.0.0.1:3000/users/avisInterpretations?email=${useremail}`)
      .then((response) => response.json())
      .then((data) => {
        if (
          data.some((database_id) => {
            return database_id === track_id;
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
  }, [track_id, interpretation, themes, storeData]);

  function saveCritere(newcritere) {
    // console.log("ajout d'un nouveau critère :", newcritere);
    setCriteres((prev) => [...prev, newcritere]);
  }

  function getRecommendations(criteresparam) {
    // console.log(
    //   "gros fetch du turfu dans le backend avec la base de donnée secrete"
    // );

    dispatch(fetchedRecommandations(criteresparam));
  }

  function handleLike() {
    fetch("http://127.0.1:3000/tracks/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        track_id: track_id,
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
        track_id: track_id,
        email: useremail,
      }),
    });
    setDejafait(true);
  }

  function resetStore() {
    dispatch(resetAnalyses());
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
            title={lyrics.title}
            id={track_id}
            artist={lyrics.artist}
            lyrics={formatedlyrics}
            uri={uri}
            email={useremail}
          />
        </section>

        {/* ALBUM */}
        <section className={styles.albumContainer}>
          <Album />
        </section>

        {/* INTERPRETATION */}
        <section className={styles.interpretationContainer}>
          <Interpretation
            track_id={track_id}
            databaseid={storeData.track_id}
            launchInterpretation={() =>
              interpretationFunction(lyrics.lyrics, lyrics.artist)
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
          <Genres genres={genres} function={saveCritere} />
        </section>

        {/* FEATURES */}
        <section className={styles.featuresContainer}>
          <Audiofeatures metadatas={metadatas} function={saveCritere} />
        </section>

        {/* FOOTER */}
        <footer className={styles.footerContainer}>
          <button
            onClick={() => {
              resetStore();
            }}
          >
            RESET
          </button>
        </footer>
      </div>
    </>
  );
}

export default Results;
