import styles from "../../assets/scss/vinyles_store/Wantlist.module.scss";
import discogsHelper from "../../modules/discogs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WantlistList from "./WantlistItem";
import Header from "./Header";

function Wantlist() {
  const discogs = useSelector((state) => state.discogs);
  const [wantedlist, setWantedlist] = useState([]);

  // Récupération de la wanted list sur Discogs
  useEffect(() => {
    (async () => {
      const response = await fetch(`http://127.0.0.1:3000/discogs/users/${discogs.username}/wantlist`, {
        credentials: "include",
      });
      const datas = await response.json();

      if (datas.result) {
        setWantedlist(datas.wantlist.wants);
        discogsHelper.setWantedlist(datas.wantlist.wants);
      }
    })();
  }, []);

  // Suppression de la release partout : state, store, bdd, discogs
  const handleDeleteRelease = async (id, indexToRemove) => {
    setWantedlist((prev) => prev.filter((_, i) => i !== indexToRemove));
    discogsHelper.toggleWantlist("remove", id);
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
