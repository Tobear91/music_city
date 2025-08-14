import styles from "../../styles/MusicLab/Tracklist.module.css";
import { useDispatch, useSelector } from "react-redux";

import Track from "./Track";

function Album(props) {
  const storeData = useSelector((state) => state.analyses.value);

  //genere la liste de tracks de l'album
  let trackslist = storeData.album.tracks.map((track, index) => (
    <Track index={index} playpreview={props.playpreview} globalIsPlaying={props.isPlaying}/>
  ));
  return (
    <div>
      <main className={styles.main}>
        <img
          src={storeData.album.image}
          alt="image de l'album"
          style={{ width: "300px", height: "auto", justifyContent:"center", display: 'flex'}} // optionnel pour taille
        />
        <div>
          <p className={styles.titleRow}>
            <div className={styles.title}>
              <span>{storeData.album.name} -</span>
              <span>- {storeData.album.date}</span>
            </div>
          </p>
        </div>

        <div className={styles.trackslist}>{trackslist}</div>
      </main>
    </div>
  );
}

export default Album;
