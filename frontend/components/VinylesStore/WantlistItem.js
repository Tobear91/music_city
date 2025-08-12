import styles from "../../assets/scss/vinyles_store/Wantlist.module.scss";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function WantlistList({ index, item, deleteRelease }) {
  return (
    <div className={styles.item}>
      <div>
        <img src={item.basic_information.thumb} alt={item.basic_information.title} />
      </div>
      <h2>{item.basic_information.title}</h2>
      <p>{item.basic_information.artists[0].name}</p>
      <div>
        <a className="button-square small purple" href={`http://127.0.0.1:3001/vinyles-store/release/${item.id}`}>
          <FontAwesomeIcon icon={faEye} />
        </a>
        <button className="button-square small red" onClick={() => deleteRelease(item.id, index)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

export default WantlistList;
