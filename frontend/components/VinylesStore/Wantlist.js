import styles from "../../assets/scss/vinyles_store/Wantlist.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { setWantlist } from "../../reducers/discogs";
import { useEffect, useState } from "react";
import WantlistList from "./WantlistItem";
import Header from "./Header";

function Wantlist() {
  const dispatch = useDispatch();
  const discogs = useSelector((state) => state.discogs);
  const [wantedlist, setWantedlist] = useState([]);

  // Récupération de la wanted list sur Discogs
  useEffect(() => {
    (async () => {
      const response = await fetch(`http://127.0.0.1:3000/discogs/users/${discogs.username}/wantlist`, {
        credentials: "include",
      });
      const datas = await response.json();

      const ids = datas.wantlist.wants.map((item) => item.id);
      dispatch(setWantlist(ids));
      setWantedlist(datas.wantlist.wants);
    })();
  }, []);

  // Suppression de la release dans le useState
  const handleDeleteRelease = async (indexToRemove) => {
    setWantedlist((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className={styles.content}>
      <Header />
      <main className={styles.main}>
        <h1>Ma wantlist Discogs</h1>
        <div className={styles.wantlist}>
          <div>{wantedlist.length > 0 && wantedlist.map((release, i) => <WantlistList key={i} index={i} item={release} deleteRelease={handleDeleteRelease} />)}</div>
        </div>
      </main>
    </div>
  );
}

export default Wantlist;
