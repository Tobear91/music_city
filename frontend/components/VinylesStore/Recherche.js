import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faLink, faUser, faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/vinyles_store/Recherche.module.scss";
import Header from "./Header";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";

function Recherche() {
  const discogs = useSelector((state) => state.discogs);
  const router = useRouter();
  const { q } = router.query;

  const [results, setResults] = useState([]);

  useEffect(() => {
    (async () => {
      if (q) {
        const body = {
          search: q,
          params: {
            type: "release",
          },
        };

        const response = await fetch(`http://127.0.0.1:3000/discogs/database/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          credentials: "include",
        });
        const datas = await response.json();
        console.log(datas);

        if (datas.result) {
          setResults(datas.results.results);
        }
      }
    })();
  }, [q]);

  return (
    <div className={styles.content}>
      <Header q={q} />
      <main className={styles.main}>
        <h1>Résultats pour "{q}"</h1>
        <div className={styles.wantlist}>
          <div>
            {results.length > 0 &&
              results.map((result, i) => {
                return (
                  <div key={i}>
                    <div>
                      {!result.thumb && <FontAwesomeIcon icon={faMusic} />}
                      {result.thumb && <img src={result.cover_image} alt={result.title} />}
                    </div>
                    <div>
                      <p>{result.title}</p>
                      {["master", "release"].includes(result.type) && (
                        <div>
                          <button className="button-square small pink">
                            <FontAwesomeIcon icon={faHeart} />
                          </button>
                          <a className="button-square small purple" href={`https://www.discogs.com/fr${result.uri}`} target="_blank">
                            <FontAwesomeIcon icon={faLink} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Recherche;
