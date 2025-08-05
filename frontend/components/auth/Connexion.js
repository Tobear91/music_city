import { useState } from "react";
import { setUser } from "../../reducers/user.js";
import styles from "../../assets/scss/auth/Connexion.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router.js";
import { useDispatch } from "react-redux";
import Spotify from "./Spotify.js";
import Image from "next/image";
import Link from "next/link";

function Connexion() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);

    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const response = await fetch("http://127.0.0.1:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const datas = await response.json();

    if (datas.result) {
      dispatch(setUser(datas.user));
      router.push("/");
    } else setError(datas.error);
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
          {error && <p>{error}</p>}
          <form onSubmit={(e) => handleSubmit(e)}>
            <input className="form-input" type="email" placeholder="john@gmail.com" name="email" required />
            <input className="form-input" type="password" placeholder="**********" name="password" required />
            <button type="submit" className="form-button primary">
              Se connecter
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </form>
          <Link href="/inscription">S'inscrire</Link>
          <span>ou</span>
          <Spotify />
        </div>
      </main>
    </section>
  );
}

export default Connexion;
