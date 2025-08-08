import styles from "../../assets/scss/vinyles_store/Release.module.scss";
import { useEffect, useState } from "react";
import Header from "./Header";
import { useRouter } from "next/router";
import { faHeart, faLink, faArrowLeft, faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

function Release() {
  const router = useRouter();
  const [release, setRelease] = useState(null);
  const discogs = useSelector((state) => state.discogs);

  // Récupération de la wanted list sur Discogs
  useEffect(() => {
    if (!router.isReady) return;

    (async () => {
      const response = await fetch(`http://127.0.0.1:3000/discogs/releases/${router.query.id}`, {
        credentials: "include",
      });
      const datas = await response.json();
      console.log(datas.release);
      if (datas.result) setRelease(datas.release);
    })();
  }, [router.isReady]);

  const isInWantList = (id) => {
    return discogs.wantlist_items.includes(parseInt(id));
  };

  return (
    <div className={styles.content}>
      <Header className={styles.header} />
      <main className={styles.main}>
        {release && (
          <>
            <button
              type="button"
              onClick={() => {
                router.back();
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Retour
            </button>
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
                  {isInWantList(router.query.id) && (
                    <span className="button-square small green">
                      <FontAwesomeIcon icon={faHeart} />
                    </span>
                  )}
                  {!isInWantList(router.query.id) && (
                    <button className="button-square small pink" onClick={(e) => handleAddToWantlist(e)}>
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                  )}
                  <a className="button-square small white" href={release.uri} target="_blank">
                    <FontAwesomeIcon icon={faLink} />
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Release;
