import { faMusic, faLink, faHeart, faEye, faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/vinyles_store/Recherche.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import discogsHelper from "../../modules/discogs";

function RechercheItem({ item }) {
  const discogs = useSelector((state) => state.discogs);

  const handleToggleWantlist = (e, action) => {
    e.preventDefault();
    discogsHelper.toggleWantlist(action, item.id);
  };

  const handleToggleCollection = (e, action) => {
    e.preventDefault();
    discogsHelper.toggleCollection(action, item.id);
  };

  const isInCollection = () => discogs.collection_items.includes(item.id);
  const isInWantList = () => discogs.wantlist_items.includes(item.id);

  return (
    <div className={styles.item}>
      <div>
        {!item.thumb && <FontAwesomeIcon icon={faMusic} />}
        {item.thumb && <img src={item.cover_image} alt={item.title} />}
      </div>
      <div>
        <p>{item.title}</p>
        <div>
          <a className="button-square small purple" href={`/vinyles-store/release/${item.id}`}>
            <FontAwesomeIcon icon={faEye} />
          </a>
          {isInCollection() && (
            <span className="button-square small green" onClick={(e) => handleToggleCollection(e, "remove")}>
              <FontAwesomeIcon icon={faCompactDisc} />
            </span>
          )}
          {!isInCollection() && (
            <button className="button-square small blue" onClick={(e) => handleToggleCollection(e, "add")}>
              <FontAwesomeIcon icon={faCompactDisc} />
            </button>
          )}
          {isInWantList() && (
            <span className="button-square small green" onClick={(e) => handleToggleWantlist(e, "remove")}>
              <FontAwesomeIcon icon={faHeart} />
            </span>
          )}
          {!isInWantList() && (
            <button className="button-square small pink" onClick={(e) => handleToggleWantlist(e, "add")}>
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
