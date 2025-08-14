import styles from "../../styles/MusicLab/Composants.module.css";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { addToCriteres } from "../../reducers/criteres";

function Thematiques(props) {
  const dispatch = useDispatch()

  const thematiquesState = useSelector(
    (state) => state.analyses.value.interpretation_by_ai.themes
  );

  if (thematiquesState) {
    const thematiques = thematiquesState.map((theme, index) => (
      <li key={index}>
        {theme}
        <button
          onClick={() => dispatch(addToCriteres(theme))}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginLeft: "8px",
            color: "#6200ee",
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </li>
    ));
    return (
      <div>
        <div className={styles.title}>THEMATIQUES:</div>
          <ol>{thematiques}</ol>
       
      </div>
    );
  }

  return (
    <div className={styles.title}>THEMATIQUES:
      <p>Lancer l'analyse pour voir les thématiques</p>
    </div>
  );
}

export default Thematiques;
