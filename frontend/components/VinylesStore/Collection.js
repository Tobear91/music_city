import styles from "../../assets/scss/vinyles_store/Wantlist.module.scss";
import discogsHelper from "../../modules/discogs";
import { useEffect, useState } from "react";
import Header from "./Header";
import Card from "./Card";

function Collection() {
  const [collectionlist, setCollectionlist] = useState([]);

  // Récupération de la wanted list sur Discogs
  useEffect(() => {
    (async () => {
      const releases = await discogsHelper.getCollection();
      discogsHelper.getWantlist();
      setCollectionlist(releases);
    })();
  }, []);

  // Suppression de la release partout : state, store, bdd, discogs
  const handleDeleteRelease = async (id, indexToRemove) => {
    setCollectionlist((prev) => prev.filter((_, i) => i !== indexToRemove));
    discogsHelper.toggleCollection("remove", id);
  };

  return (
    <div className={styles.content}>
      <Header />
      <main className={styles.main}>
        <h1>Ma collection de vinyles</h1>
        <div className={styles.wantlist}>
          <div>{collectionlist.length > 0 && collectionlist.map((release, i) => <Card key={i} index={i} item={release} deleteRelease={handleDeleteRelease} />)}</div>
        </div>
      </main>
    </div>
  );
}

export default Collection;
