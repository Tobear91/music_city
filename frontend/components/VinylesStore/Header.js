import { faXmark, faMagnifyingGlass, faBarcode, faHeart, faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/VinylesStore/Header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { leaveApplication } from "../../modules/appinteraction";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalBarcode from "./ModalBarcode";
import { useRouter } from "next/router";

function Header({ q }) {
  const router = useRouter();
  const discogs = useSelector((state) => state.discogs);
  const [searchValue, setSearchValue] = useState(q || "");
  const [openModal, setOpenModal] = useState(false);

  // Hook qui permet de récupérer la recherche depuis l'URL pour l'injecter dans l'input du formulaire
  useEffect(() => {
    setSearchValue(q || "");
  }, [q]);

  // Redirection vers la page de recherche
  const handleRecherche = (e) => {
    e.preventDefault();
    if (searchValue.trim() !== "") router.push(`/vinyles-store/recherche?q=${encodeURIComponent(searchValue)}`);
  };

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

      {/* Composant Modal */}
      {openModal && <ModalBarcode setOpenModal={(value) => setOpenModal(value)} />}
    </>
  );
}

export default Header;
