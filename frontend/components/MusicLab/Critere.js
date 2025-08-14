import styles from "../../styles/MusicLab/RecommandationsFavoris.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
function Critere(props) {


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
