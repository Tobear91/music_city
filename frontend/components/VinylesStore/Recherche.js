import styles from "../../assets/scss/vinyles_store/Recherche.module.scss";
import { useEffect, useState } from "react";
import RechercheItem from "./RechercheItem";
import { useRouter } from "next/router";
import Header from "./Header";

function Recherche() {
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
        if (datas.result) setResults(datas.results.results);
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
