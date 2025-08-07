import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faMagnifyingGlass, faHeart, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/vinyles_store/Homepage.module.scss";

function Homepage() {
  const [wantlist, setWantlist] = useState([]);

  useEffect(() => {
    (async () => {
      let response = await fetch("http://127.0.0.1:3000/discogs/identity", {
        credentials: "include",
      });
      let datas = await response.json();
      console.log(datas);
      const { username } = datas.identity;

      response = await fetch(`http://127.0.0.1:3000/discogs/users/${username}/wantlist`, {
        credentials: "include",
      });
      datas = await response.json();
      console.log(datas);
      setWantlist(datas.wantlist.wants);
    })();
  }, []);

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <button className="button-bulle purple">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <span>Vinyles Store</span>
        <form>
          <input type="text" className="form-input" placeholder="Artiste / Track / Code Barre" />
          <button type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
        <button className="button-bulle pink">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </header>
      <main className={styles.main}>
        <h1>Ma wantlist</h1>
        <div className={styles.wantlist}>
          {wantlist.length > 0 &&
            wantlist.map((release, i) => {
              return (
                <div key={i}>
                  <div>
                    <img src={release.basic_information.thumb} alt={release.basic_information.title} />
                  </div>
                  <h2>{release.basic_information.title}</h2>
                  <p>{release.basic_information.artists[0].name}</p>
                  <div>
                    <button className="button-square pink">
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                    <button className="button-square purple">
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}

export default Homepage;
