import { faMagnifyingGlass, faBarcode, faHeart, faCompactDisc, faEye } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/VinylesStore/Header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { useState } from "react";

function ModalBarcode({ setOpenModal }) {
  const discogs = useSelector((state) => state.discogs);
  const [codebarResults, setCodebarResults] = useState([]);

  const handleBarcode = async (e) => {
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
    <section className={styles.modal} onClick={() => setOpenModal(false)}>
      <div onClick={(e) => e.stopPropagation()}>
        <FontAwesomeIcon icon={faBarcode} />
        <form onSubmit={(e) => handleBarcode(e)}>
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
  );
}

export default ModalBarcode;
