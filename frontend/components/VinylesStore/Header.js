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
  const [openModal, setOpenModal] = useState(false);

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

    if (datas.result && datas.results.pagination.items > 0) {
      console.log(datas.results.results[0]);
      router.push(`/vinyles-store/release/${datas.results.results[0].id}`);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <button className="button-bulle purple">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <span>Vinyles Store</span>
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
        <button className="button-bulle pink">
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
          </div>
        </section>
      )}
    </>
  );
}

export default Header;
