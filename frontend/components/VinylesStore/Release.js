import { faHeart, faLink, faArrowLeft, faCoins, faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/VinylesStore/Release.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import discogsHelper from "../../modules/discogs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Header from "./Header";

function Release() {
  const router = useRouter();
  const [release, setRelease] = useState(null);
  const discogs = useSelector((state) => state.discogs);

  // Hook pour récupérer la release quand le router est bien chargé
  useEffect(() => {
    if (!router.isReady) return;

    (async () => {
      const datas = await discogsHelper.getRelease(router.query.id);
      if (datas.result) setRelease(datas.release);
      else setRelease(false);
    })();
  }, [router.isReady]);

  // Ajout ou suppresion de la wantlist (impacte le store, la bdd et l'api discogs si user connecté)
  const handleToggleWantlist = (e, action) => {
    e.preventDefault();
    discogsHelper.toggleWantlist(action, release.id);
  };

  // Ajout ou suppresion de la collection (impacte le store, la bdd et l'api discogs si user connecté)
  const handleToggleCollection = (e, action) => {
    e.preventDefault();
    discogsHelper.toggleCollection(action, release.id);
  };

  // Discute avec le store pour savoir si la release est déjà en wantlist ou collection
  const isInCollection = () => discogs.collection_items.includes(release.id);
  const isInWantList = () => discogs.wantlist_items.includes(release.id);

  return (
    <div className={styles.content}>
      <Header className={styles.header} />
      <main className={styles.main}>
        <button
          type="button"
          onClick={() => {
            router.back();
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Retour
        </button>
        {release && (
          <div>
            <div className={styles.cover}>
              <img src={release.images[0].resource_url} alt="" />
            </div>
            <div className={styles.infos}>
              <h1>{release.artists[0].name}</h1>
              <h2>{release.title}</h2>
              {release.styles.length > 0 && <h3>{release.styles[0]}</h3>}
              {release.lowest_price && (
                <p>
                  <FontAwesomeIcon icon={faCoins} /> Prix le plus bas : {release.lowest_price}€
                </p>
              )}

              <div className={styles.links}>
                {isInCollection(router.query.id) && (
                  <span className="button-square small green" onClick={(e) => handleToggleCollection(e, "remove")}>
                    <FontAwesomeIcon icon={faCompactDisc} />
                  </span>
                )}
                {!isInCollection(router.query.id) && (
                  <button className="button-square small blue" onClick={(e) => handleToggleCollection(e, "add")}>
                    <FontAwesomeIcon icon={faCompactDisc} />
                  </button>
                )}
                {isInWantList(router.query.id) && (
                  <span className="button-square small green" onClick={(e) => handleToggleWantlist(e, "remove")}>
                    <FontAwesomeIcon icon={faHeart} />
                  </span>
                )}
                {!isInWantList(router.query.id) && (
                  <button className="button-square small pink" onClick={(e) => handleToggleWantlist(e, "add")}>
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                )}
                <a className="button-square small white" href={release.uri} target="_blank">
                  <FontAwesomeIcon icon={faLink} />
                </a>
              </div>
            </div>
          </div>
        )}
        {release === false && <h1>Le vinyle est introuvable</h1>}
      </main>
    </div>
  );
}

export default Release;
