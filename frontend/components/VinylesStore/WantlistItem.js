import styles from "../../assets/scss/vinyles_store/Wantlist.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleWantlistItem } from "../../reducers/discogs";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";

function WantlistList({ index, item, deleteRelease }) {
  const dispatch = useDispatch();
  const discogs = useSelector((state) => state.discogs);

  // Suppresion de la release dans la wanted list sur Discogs
  const handleDelete = async () => {
    const response = await fetch(`http://127.0.0.1:3000/discogs/users/${discogs.username}/wants/${item.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const datas = await response.json();
    if (datas.result) {
      dispatch(toggleWantlistItem(item.id));
      deleteRelease(index);
    }
  };

  return (
    <div className={styles.item}>
      <div>
        <img src={item.basic_information.thumb} alt={item.basic_information.title} />
      </div>
      <h2>{item.basic_information.title}</h2>
      <p>{item.basic_information.artists[0].name}</p>
      <div>
        <button className="button-square small red" onClick={() => handleDelete()}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

export default WantlistList;
