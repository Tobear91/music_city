import styles from "../../assets/scss/auth/Inscription.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router.js";
import Spotify from "./Spotify.js";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Inscription() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);

    const body = {
      pseudo: formData.get("pseudo"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const response = await fetch("http://127.0.0.1:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const datas = await response.json();

    if (datas.result) {
      router.push("/connexion");
    } else setError(datas.error);
  };

  return (
    <section className={styles.inscription}>
      <aside>
        <Image src="/img/cloudy_moon.jpg" alt="Cloudy Moon" width={707} height={194} priority />
        <h1>Inscription</h1>
      </aside>
      <main>
        <div>
          <h2>Créer un compte</h2>
          <p>Rejoins-nous en moins de 2 minutes. C’est simple, rapide, et sans engagement.</p>
          {error && <p>{error}</p>}
          <form onSubmit={(e) => handleSubmit(e)}>
            <input className="form-input" type="text" placeholder="Pseudo" name="pseudo" required />
            <input className="form-input" type="email" placeholder="Email" name="email" required />
            <input className="form-input" type="password" placeholder="Mot de passe" name="password" required />
            <button type="submit" className="form-button primary">
              S'inscrire
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </form>
          <Link href="/connexion">Se connecter</Link>
          <span>ou</span>
          <Spotify />
        </div>
      </main>
    </section>
  );
}

export default Inscription;
