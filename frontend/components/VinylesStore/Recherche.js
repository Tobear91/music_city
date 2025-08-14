import styles from "../../assets/scss/VinylesStore/Recherche.module.scss";
import discogsHelper from "../../modules/discogs";
import { useEffect, useState } from "react";
import RechercheItem from "./RechercheItem";
import { useRouter } from "next/router";
import Header from "./Header";

function Recherche() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);

  // Hook qui récupère la valeur de l'input recherche
  useEffect(() => {
    (async () => {
      if (q) {
        const body = {
          search: q,
          params: {
            type: "release",
          },
        };
        const datas = await discogsHelper.search(body);
        if (datas.result) setResults(datas.results);
      }
    })();
  }, [q]);

  return (
    <div className={styles.content}>
      <Header q={q} />
      <main className={styles.main}>
        <h1>
          {results.length} Résultats pour "{q}"
        </h1>
        <div className={styles.search}>
          <div>{results.length > 0 && results.map((result, i) => <RechercheItem key={i} item={result} />)}</div>
        </div>
      </main>
    </div>
  );
}

export default Recherche;
