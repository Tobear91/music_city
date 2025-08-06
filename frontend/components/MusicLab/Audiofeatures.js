import React from "react";
import styles from "../../styles/MusicLab/Audiofeatures.module.css";

const Audiofeatures = (props) => {
  if (!props.features || Object.keys(props.features).length === 0) {
    return (
      <div>
        <main className={styles.main}>
        <h1 className={styles.title}>AUDIO FEATURES :</h1>
        <div className={styles.container}>
          Aucune donnée d'audio features disponible.
        </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>AUDIO FEATURES :</h1>
      <ul className={styles.list}>
        <li>
          <strong>Danceability:</strong> {features.danceability}
        </li>
        <li>
          <strong>Energy:</strong> {features.energy}
        </li>
        <li>
          <strong>Tempo:</strong> {features.tempo}
        </li>
        <li>
          <strong>Valence:</strong> {features.valence}
        </li>
        <li>
          <strong>Acousticness:</strong> {features.acousticness}
        </li>
        <li>
          <strong>Instrumentalness:</strong> {features.instrumentalness}
        </li>
        <li>
          <strong>Liveness:</strong> {features.liveness}
        </li>
        <li>
          <strong>Speechiness:</strong> {features.speechiness}
        </li>
      </ul>
    </div>
  );
};

export default Audiofeatures;
