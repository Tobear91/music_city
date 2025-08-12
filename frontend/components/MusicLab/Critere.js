import styles from "../../styles/MusicLab/Recommandations.module.css";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCriteres,
  removeFromCriteres,
  resetCriteres,
} from "../../reducers/criteres";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
function Critere(props) {
  const dispatch = useDispatch();
  const criteres = useSelector((state) => state.criteres.value.criteres) || [];

  return (
    <div>
      <div className={styles.criteres}>
        <span>{props.critere}</span>
        <button
          onClick={() => {
            props.remove();
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginLeft: "8px",
            color: "#6200ee",
          }}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
      </div>
    </div>
  );
}

export default Critere;
