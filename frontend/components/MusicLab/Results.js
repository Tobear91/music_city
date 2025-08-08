import styles from "../../styles/MusicLab/Results.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
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
} from "../../reducers/analyses";
import { replaceLinesBreacksWithBr } from "../../modules/formatages";

function Results() {
  const dispatch = useDispatch();
  const router = useRouter();
  const storeData = useSelector((state) => state.analyses.value);
  const [criteres, setCriteres] = useState([]);

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

    // const avis = await fetch(
    //   `http://127.0.1:3000/tracks/like?track_id=${track_id}`
    // );
    // console.log("Avis sur l'interprétation :", await avis.json());
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
        release_date: storeData.release_date,
      }),
    }).then((response) => response.json());

    // console.log(lyrics.lyrics);
  }, [storeData]);

  function saveCritere(newcritere) {
    console.log("ajout d'un nouveau critère :", newcritere);
    setCriteres((prev) => [...prev, newcritere]);
  }

  function getRecommendations(criteresparam) {
    console.log(
      "gros fetch du turfu dans le backend avec la base de donnée secrete"
    );

    // dispatch(fetchedRecommandations(criteresparam));
  }

  function handleLike() {
    console.log("Liked");
  }

  function handleDislike() {
    console.log("Disliked");
  }

  function resetStore() {
    dispatch(resetAnalyses());
  }

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>HEADER</h1>
        <h2 className={styles.title}>Résultats de l'analyse</h2>
        <div>
          <Lyrics
            title={lyrics.title}
            artist={lyrics.artist}
            lyrics={replaceLinesBreacksWithBr(lyrics.lyrics)}
            uri={uri}
          />
        </div>
        <div>
          <Album
            name={album.name}
            image={album.image}
            tracks={album.tracks}
            date={album.date}
          />
        </div>
        <div>
          <Genres genres={genres} function={saveCritere} />
        </div>
        <div>
          <div>
            <Interpretation
              track_id={track_id}
              launchInterpretation={() =>
                interpretationFunction(lyrics.lyrics, lyrics.artist)
              }
            />
          </div>
          <div>
            <Thematiques />
          </div>
          <div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
            <p>Êtes-vous d'accord avec cette interpretation?</p>
            <button
              onClick={handleLike}
              style={{
                padding: "8px 16px",
                margin: "10px",
                // backgroundColor: liked ? "green" : "#eee",
                // color: liked ? "white" : "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              D'accord ()
            </button>

            <button
              onClick={handleDislike}
              style={{
                padding: "8px 16px",
                margin: "10px",
                // backgroundColor: disliked ? "red" : "#eee",
                // color: disliked ? "white" : "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Pas d'accord ()
            </button>
          </div>
        </div>
        <div>
          <Audiofeatures metadatas={metadatas} function={saveCritere} />
        </div>
        <div>
          <button
            onClick={() => {
              getRecommendations(criteres);
              router.push("/musiclab/recommandations");
            }}
          >
            FOOTER RECOMMANDATIONS PAR CRITERES
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              resetStore();
            }}
          >
            {" "}
            RESET
          </button>
        </div>
      </main>
    </div>
  );
}

export default Results;
