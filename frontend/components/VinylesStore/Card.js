import styles from "../../assets/scss/vinyles_store/Card.module.scss";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Card({ index, item, deleteRelease }) {
  return (
    <div className={styles.item}>
      <div>
        <img src={item.thumb} alt={item.title} />
      </div>
      <div>
        <h2>{item.title}</h2>
        <p>{item.artist}</p>
        <div>
          <a className="button-square small purple" href={`http://127.0.0.1:3001/vinyles-store/release/${item.release_id}`}>
            <FontAwesomeIcon icon={faEye} />
          </a>
          <button className="button-square small red" onClick={() => deleteRelease(item.release_id, index)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
