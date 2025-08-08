import { faXmark, faBars, faMagnifyingGlass, faBarcode, faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/vinyles_store/Header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function Header({ q, nbWants }) {
  const router = useRouter();
  const discogs = useSelector((state) => state.discogs);
  const [searchValue, setSearchValue] = useState(q || "");

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

  return (
    <header className={styles.header}>
      <button className="button-bulle purple">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <span>Vinyles Store</span>
      <button className="button-square pink" onClick={() => router.push("/vinyles-store/wantlist")}>
        <span>{discogs.wantlist_items.length}</span>
        <FontAwesomeIcon icon={faHeart} />
      </button>
      <button className="button-square purple">
        <FontAwesomeIcon icon={faBarcode} />
      </button>
      <form onSubmit={(e) => handleRecherche(e)}>
        <input type="text" className="form-input" placeholder="Rechercher sur Discogs" name="search" autoComplete="off" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
      <button className="button-bulle pink">
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </header>
  );
}

export default Header;
