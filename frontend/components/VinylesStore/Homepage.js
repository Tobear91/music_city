import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/vinyles_store/Homepage.module.scss";
import Header from "./Header";

function Homepage() {
  const [wantlist, setWantlist] = useState([]);
  const [dUsername, setDUsername] = useState(null);

  useEffect(() => {
    (async () => {
      let response = await fetch("http://127.0.0.1:3000/discogs/identity", {
        credentials: "include",
      });
      let datas = await response.json();
      console.log(datas);
      const { username } = datas.identity;
      setDUsername(username);

      response = await fetch(`http://127.0.0.1:3000/discogs/users/${username}/wantlist`, {
        credentials: "include",
      });
      datas = await response.json();
      console.log(datas);
      setWantlist(datas.wantlist.wants);
    })();
  }, []);

  const handleDelete = async (id, indexToRemove) => {
    const response = await fetch(`http://127.0.0.1:3000/discogs/users/${dUsername}/wants/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const datas = await response.json();
    if (datas.result) setWantlist((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className={styles.content}>
      <Header />
      <main className={styles.main}>
        <h1>Ma wantlist</h1>
        <div className={styles.wantlist}>
          <div>
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
                      <button className="button-square small pink">
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                      <button className="button-square small purple">
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                      <button className="button-square small red" onClick={() => handleDelete(release.basic_information.id, i)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
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

export default Homepage;
