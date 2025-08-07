import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faMagnifyingGlass, faBarcode } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/vinyles_store/Homepage.module.scss";
import { useRouter } from "next/router";

function Header({ q }) {
  const router = useRouter();

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
      <button className="button-square purple">
        <FontAwesomeIcon icon={faBarcode} />
      </button>
      <form onSubmit={(e) => handleRecherche(e)}>
        <input type="text" className="form-input" placeholder="Rechercher sur Discogs" name="search" autoComplete="off" />
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
