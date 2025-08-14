import styles from "../../styles/MusicLab/Footer.module.css";
import Critere from "./Critere";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCriteres,
} from "../../reducers/criteres";

import { setRecommandationsList } from "../../reducers/recommandations";

function Footer(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const criteres = useSelector((state) => state.criteres.value.criteres) || [];

  async function handleClickRecommandations(array) {
    const body = array;
    const recommandations = await fetch(
      `http://127.0.0.1:3000/tracks/recommandations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await recommandations.json();
    dispatch(setRecommandationsList(data.tracks));

    if (props.audioRef.current) {
      //permet d'eviter undefined error sur audioRef.current si rien ne joue
      props.audioRef.current.pause();
      props.setIsPlaying(false);
    }

    router.push("/music-lab/recommandations");
  }

  function handleRemove(word) {
    dispatch(removeFromCriteres(word));
  }

  function handleClickFavoris() {
    if (props.audioRef.current) {
      //permet d'eviter undefined error sur audioRef.current si rien ne joue
      props.audioRef.current.pause();
      props.setIsPlaying(false);
    }
    router.push("/music-lab/favoris");
  }
  const list = criteres.map((critere, index) => (
    <Critere critere={critere} remove={() => handleRemove(critere)} />
  ));

  return (
    <div className={styles.footer}>
      <div>
        <button
          className={"form-button primary"}
          style={{ width: 600, height: 35 }}
          onClick={() => handleClickFavoris(criteres)}
        >
          FAVORIS
        </button>
      </div>
      <div>
        <button
          className={"form-button primary"}
          style={{ width: 600, height: 35 }}
          onClick={() => handleClickRecommandations(criteres)}
        >
          RECOMMANDATIONS PAR CRITERES
        </button>
        <div className={styles.criteresList}>{list}</div>
      </div>
    </div>
  );
}

export default Footer;
