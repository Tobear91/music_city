import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../reducers/user.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import styles from "../../assets/scss/auth/Connexion.module.scss";
import Image from "next/image";

function Connexion() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.user) {
      const jsonString = atob(router.query.user);
      const datas = JSON.parse(jsonString);
      dispatch(setUser(datas));
    }
  }, [router.isReady]);

  useEffect(() => {
    if (user?.email) router.push("/");
  }, [user?.email]);

  const handleLogin = async () => {
    const response = await fetch("http://127.0.0.1:3000/spotify/login");
    const datas = await response.json();
    router.push(datas.redirect_url);
  };

  return (
    <section className={styles.connexion}>
      <aside>
        <Image src="/img/cloudy_moon.jpg" alt="Cloudy Moon" width={707} height={194} priority />
        <h1>Connexion</h1>
      </aside>
      <main>
        <div>
          <h2>Connexion</h2>
          <form>
            <input className="form-input" type="text" placeholder="john@gmail.com" />
            <input className="form-input" type="password" placeholder="**********" />
            <button type="submit" className="form-button primary">
              Se connecter
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </form>
          <span>ou</span>
          <button className="form-button spotify" onClick={() => handleLogin()}>
            Spotify
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </main>
    </section>
  );
}

export default Connexion;
