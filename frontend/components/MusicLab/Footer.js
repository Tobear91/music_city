import styles from "../../styles/MusicLab/Footer.module.css";
import Critere from "./Critere";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCriteres,
  removeFromCriteres,
  resetCriteres,
} from "../../reducers/criteres";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
faArrowRight
} from "@fortawesome/free-solid-svg-icons";

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
    router.push("/MusicLab/recommandations");
  }

  function handleRemove(word) {
    dispatch(removeFromCriteres(word));
  }

  const list = criteres.map((critere, index) => (
    <Critere critere={critere} remove={() => handleRemove(critere)} />
  ));

  return (
    <div className={styles.footer}>
      <div className={styles.button}>
        <button className={"form-button primary"} style={{width:500}} onClick={() => handleClickRecommandations(criteres)}>
          Decouvrir nos Recommandations pour :
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div className={styles.criteresList}>{list}</div>
    </div>
  );
}

export default Footer;
