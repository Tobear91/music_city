import styles from "../../styles/MusicLab/Album.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { replaceMsWithMinutesAndSeconds } from "../../modules/formatages";

function Album(props) {
  const storeData = useSelector((state) => state.analyses.value);
  // useEffect(() => {
  //   console.log("Contenu du store :", storeData);
  // }, [storeData]);

  let trackslist = props.tracks.map((track, index) => (
    <div key={index}>
      <p>
        {track.track_number} - {track.name} :{" "}
        {replaceMsWithMinutesAndSeconds(track.duration_ms)} PLAY({track.uri})
        ADDTOFAVORITE({track.id})
      </p>
    </div>
  ));

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>ALBUM :</h1>
        <div>
          <p>
            <span>{props.name}</span> - <span>{props.date}</span>{" "}
            <span>{props.image}</span>
          </p>
        </div>

        <div>{trackslist}</div>
      </main>
    </div>
  );
}

export default Album;
