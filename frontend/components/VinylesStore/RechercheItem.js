import { faMusic, faLink, faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/vinyles_store/Recherche.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleWantlistItem } from "../../reducers/discogs";
import { useSelector, useDispatch } from "react-redux";

function RechercheItem({ item }) {
  const dispatch = useDispatch();
  const discogs = useSelector((state) => state.discogs);

  // Ajouter dans la wantlist Discogs
  const handleAddToWantlist = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://127.0.0.1:3000/discogs/users/${discogs.username}/wants/${item.id}`, {
      method: "PUT",
      credentials: "include",
    });
    const datas = await response.json();

    if (datas.result) dispatch(toggleWantlistItem(item.id));
  };

  const isInWantList = () => {
    return discogs.wantlist_items.includes(item.id);
  };

  return (
    <div className={styles.item}>
      <div>
        {!item.thumb && <FontAwesomeIcon icon={faMusic} />}
        {item.thumb && <img src={item.cover_image} alt={item.title} />}
      </div>
      <div>
        <p>{item.title}</p>
        <div>
          {isInWantList() && (
            <span className="button-square small green">
              <FontAwesomeIcon icon={faHeart} />
            </span>
          )}
          {!isInWantList() && (
            <button className="button-square small pink" onClick={(e) => handleAddToWantlist(e)}>
              <FontAwesomeIcon icon={faHeart} />
            </button>
          )}
          <a className="button-square small purple" href={`https://www.discogs.com/fr${item.uri}`} target="_blank">
            <FontAwesomeIcon icon={faLink} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default RechercheItem;
