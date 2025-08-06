import styles from "../../styles/MusicLab/Results.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import  Lyrics  from "./Lyrics";
import  Album  from "./Album";
import  Genres  from "./Genres";
import  Interpretation  from "./Interpretation";
import  Thematiques  from "./Thematiques";
import  Audiofeatures  from "./Audiofeatures";
import Recommandations from "./Recommandations";

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
    interpretation,
    themes,
    metadatas,
    genres,
  } = storeData;
  
  // const lyrics = storeData.lyrics.lyrics;

  useEffect(() => {
    console.log("Contenu du store :", storeData);
    
    console.log(lyrics.lyrics);
  }, [storeData]);

  function saveCritere(newcritere) {
    console.log("ajout d'un nouveau critère :", newcritere);
    setCriteres((prev) => [...prev, newcritere]);
  }

  function getRecommendations(criteresparam) {
    console.log("gros fetch du turfu dans le backend avec la base de donnée secrete")

    // dispatch(fetchedRecommandations(criteresparam));
  }

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>HEADER</h1>
        <h2 className={styles.title}>Résultats de l'analyse</h2>
        <Lyrics
          title={lyrics.title}
          artist={lyrics.artist}
          lyrics={lyrics.lyrics}
          uri={uri}
        />
        <Album
          name={album.name}
          image={album.image}
          tracks={album.tracks}
          date={album.date}
        />
        <Genres genres={genres} function={saveCritere} />
        <Interpretation interpretation={interpretation} />
        <Thematiques themes={themes} />
        <Audiofeatures metadatas={metadatas} function={saveCritere} />
        <button
          onClick={() => {
            getRecommendations(criteres);
            router.push("/musiclab/recommandations");
          }}
        >
          FOOTER RECOMMANDATIONS PAR CRITERES
        </button>
      </main>
    </div>
  );
}

export default Results;
