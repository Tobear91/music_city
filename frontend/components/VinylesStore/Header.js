import { faXmark, faMagnifyingGlass, faBarcode, faHeart, faCompactDisc, faEye } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/vinyles_store/Header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { leaveApplication } from "../../modules/appinteraction";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function Header({ q }) {
  const router = useRouter();
  const discogs = useSelector((state) => state.discogs);
  const [searchValue, setSearchValue] = useState(q || "");
  const [openModal, setOpenModal] = useState(false);
  const [codebarResults, setCodebarResults] = useState([]);

  useEffect(() => {
    setSearchValue(q || "");
  }, [q]);

  const handleRecherche = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get("search");

    if (search.trim() !== "") {
      router.push(`/vinyles-store/recherche?q=${encodeURIComponent(search)}`);
    }
  };

  const handleCodeBarre = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const barcode = formData.get("barcode");

    const body = {
      search: "",
      params: {
        barcode,
      },
    };

    const response = await fetch(`http://127.0.0.1:3000/discogs/database/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    const datas = await response.json();
    if (datas.result) setCodebarResults(datas.results);
  };

  const isInCollection = (id) => discogs.collection_items.includes(id);
  const isInWantList = (id) => discogs.wantlist_items.includes(id);

  return (
    <>
      <header className={styles.header}>
        <span>Vinyles Store</span>
        <button className="button-square blue" onClick={() => router.push("/vinyles-store/collection")}>
          <span>{discogs.collection_items.length}</span>
          <FontAwesomeIcon icon={faCompactDisc} />
        </button>
        <button className="button-square pink" onClick={() => router.push("/vinyles-store/wantlist")}>
          <span>{discogs.wantlist_items.length}</span>
          <FontAwesomeIcon icon={faHeart} />
        </button>
        <button className="button-square purple" onClick={() => setOpenModal(true)}>
          <FontAwesomeIcon icon={faBarcode} />
        </button>
        <form onSubmit={(e) => handleRecherche(e)}>
          <input type="text" className="form-input" placeholder="Rechercher sur Discogs" name="search" autoComplete="off" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
          <button type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
        <button className="button-bulle pink" onClick={() => leaveApplication(router)}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </header>

      {openModal && (
        <section className={styles.modal} onClick={() => setOpenModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <FontAwesomeIcon icon={faBarcode} />
            <form onSubmit={(e) => handleCodeBarre(e)}>
              <input type="text" className="form-input" placeholder="Ton code barre" name="barcode" autoComplete="off" />
              <button type="submit">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>
            <div>
              {codebarResults.length === 0 && <p>Aucuns résultats</p>}
              {codebarResults.length > 0 &&
                codebarResults.map((result, i) => {
                  return (
                    <div key={i}>
                      {result.thumb && <img src={result.thumb} alt={result.title} width={50} />}
                      {!result.thumb && <FontAwesomeIcon icon={faCompactDisc} />}
                      <div className={styles.infos}>
                        <p>{result.title}</p>
                        <p>{result.format.length > 0 && result.format.join(", ")}</p>
                      </div>
                      <div className={styles.actions}>
                        {isInCollection(result.id) && (
                          <span className="button-square small green">
                            <FontAwesomeIcon icon={faCompactDisc} />
                          </span>
                        )}
                        {isInWantList(result.id) && (
                          <span className="button-square small green">
                            <FontAwesomeIcon icon={faHeart} />
                          </span>
                        )}
                        <a className="button-square small purple" href={`/vinyles-store/release/${result.id}`}>
                          <FontAwesomeIcon icon={faEye} />
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Header;
