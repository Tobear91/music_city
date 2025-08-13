import styles from "../../assets/scss/vinyles_store/Connexion.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { setUsername } from "../../reducers/discogs.js";
import { useDispatch, useSelector } from "react-redux";
import { setDiscogs } from "../../reducers/user.js";
import discogsHelper from "../../modules/discogs";
import { useRouter } from "next/router.js";
import { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Connexion() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [error, setError] = useState(null);

  // Hook permettant d'attendre que le router soit pret
  useEffect(() => {
    if (!router.isReady) return;

    // Récupération dans l'URL d'un param discogs puis mise à jour du store sinon redirection vers la page de connexion
    if (router.query.discogs) {
      const jsonString = atob(router.query.discogs);
      const datas = JSON.parse(jsonString);
      if (datas.connected) dispatch(setDiscogs(true));
      else setError("Erreur lors de la connexion avec Discogs");
    }
  }, [router.isReady]);

  /**
   * Hook qui attend que le user Discogs soit connecté pour pouvoir appeler la method identity
   * Pour save le username discogs dans un store
   */
  useEffect(() => {
    (async () => {
      if (user.discogs) {
        const datas = await discogsHelper.getIdentity();

        if (datas.result) {
          const { username } = datas.identity;
          dispatch(setUsername(username));
          router.push("/vinyles-store/collection");
        } else setError(datas.error);
      }
    })();
  }, [user.discogs]);

  /**
   * Fonction qui au clique permet de récupérer via le back l'URL de connexion à l'app Discogs
   * credentials: "include" passe un cookie du front au back, doit être passé pour chaque requête vers le back /discogs
   */
  const handleDiscogsConnexion = async () => {
    const datas = await discogsHelper.getAuthorizeUrl();
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
          <button className="form-button primary" onClick={() => handleDiscogsConnexion()}>
            Discogs
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <Link href="/vinyles-store/collection">Continuer sans se connecter à Discogs</Link>
        </div>
      </main>
    </section>
  );
}

export default Connexion;
