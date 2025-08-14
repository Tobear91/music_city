import styles from "../../styles/MusicLab/Composants.module.css";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { addToCriteres } from "../../reducers/criteres";

function Genres(props) {
  const dispatch = useDispatch()
  let genreslist = props.genres.map((genre, index) => (
    <li key={index}>
      <span>{genre}</span>
      <button
        onClick={() =>dispatch(addToCriteres(genre))}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginLeft: "8px",
          color: "#6200ee", // violet par exemple
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </li>
  ));

  return (
    <div>
      <h1 className={styles.title}>GENRES MUSICAUX :</h1>
      <ol>{genreslist}</ol>
    </div>
  );
}

export default Genres;
