import { useState } from "react";
import { setDiscogs } from "../../reducers/user.js";
import styles from "../../assets/scss/vinyles_store/Connexion.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router.js";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { setUsername } from "../../reducers/discogs.js";

function Connexion() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.discogs) {
      const jsonString = atob(router.query.discogs);
      const datas = JSON.parse(jsonString);
      if (datas.connected) dispatch(setDiscogs(true));
    }
  }, [router.isReady]);

  useEffect(() => {
    (async () => {
      if (user?.discogs) {
        let response = await fetch("http://127.0.0.1:3000/discogs/identity", {
          credentials: "include",
        });
        let datas = await response.json();

        if (datas.result) {
          const { username } = datas.identity;
          dispatch(setUsername(username));
          router.push("/vinyles-store/wantlist");
        }
      }
    })();
  }, [user?.discogs]);

  const handleDiscord = async (e) => {
    const response = await fetch(`http://127.0.0.1:3000/discogs/authorize?email=${user.email}`, {
      credentials: "include",
    });
    const datas = await response.json();

    if (datas.result) {
      router.push(datas.authorize_url);
    } else setError(datas.error);
  };

  return (
    <section className={styles.connexion}>
      <aside>
        <Image src="/img/cloudy_moon.jpg" alt="Cloudy Moon" width={707} height={194} priority />
        <h1>Vinyles Store</h1>
      </aside>
      <main>
        <div>
          <h2>Connectez-vous avec votre compte</h2>
          {error && <p>{error}</p>}
          <button className="form-button primary" onClick={() => handleDiscord()}>
            Discogs
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <Link href="/">Où continuer sans se connecter</Link>
        </div>
      </main>
    </section>
  );
}

export default Connexion;
