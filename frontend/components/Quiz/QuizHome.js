import styles from "../../assets/scss/quiz/QuizHome.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/router";
import { leaveApplication } from "../../modules/appinteraction";
import { useSelector } from "react-redux";
import Spotify from "../auth/Spotify";

export default function QuizHome() {
  const router = useRouter();
  // Verifier si l'utilisateur est connecté avec Spotify ou non
  const spotifyType = useSelector((state) => state.user.user.spotify.type);

  // redirige vers la liste des playlists
  const handlePlaylistQuiz = () => {
    router.push("/quiz/playlist");
  };

  // redirige vers le quiz des morceaux liké
  const handleStartQuiz = () => {
    router.push("/quiz/quiz");
  };

  // Connexion à spotify pour accéder aux quiz
  const handleSpotifyLogin = async () => {
    const response = await fetch("http://127.0.0.1:3000/spotify/login");
    const data = await response.json();
    router.push(data.redirect_url);
  };

  // Ecran d'accueil
  return (
    <div className={styles.quizHome}>
      <div className={styles.quizLeft}>
        <Image
          src="/img/cloudy_moon.jpg"
          alt="Cloudy Moon"
          width={707}
          height={194}
          priority
        />
        <h1 className={styles.quizTitle}>QUIZ</h1>
      </div>

      <button
        className="button-bulle pink "
        style={{ position: "fixed", top: 20, right: 20, zIndex: 1 }}
        onClick={() => leaveApplication(router)}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <div className={styles.quizRight}>
        <h2 className={styles.welcomeTitle}>
          Bienvenue sur le Quiz de Music City
        </h2>
        <p className={styles.description}>
          Testez vos connaissances musicales sur un quiz de 10 questions parmi
          deux choix :
        </p>
        <ul className={styles.descriptionList}>
          <li>Vos playlists que vous possédez sur votre compte Spotify - (Necessite une connexion à Spotify)</li>
          <li>Vos titres favoris - (Necessite une connexion à Spotify)</li>
        </ul>
        <h3 className={styles.chooseTitle}>Choisissez votre Quiz</h3>

        <div className={styles.buttonContainer}>
          {spotifyType === "simple" ? (
            <>
            Malheuresement, il faut te connecter à Spotify pour accéder à ces Quiz... Pour le moment ! 
              <button
                className="form-button primary"
                onClick={() => leaveApplication(router)}
              >
                Revenir sur la map
                <FontAwesomeIcon icon={faArrowRight} />
              </button>

              <p>Ou</p>

              <button className="form-button spotify" onClick={handleSpotifyLogin}>
                Se connecter avec Spotify
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </>
            
          ) : (
            <>
              <button
                className="form-button primary"
                onClick={handlePlaylistQuiz}
              >
                En fonction d'une de mes playlists
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
              <button
                className="form-button primary"
                onClick={handleStartQuiz}
              >
                Morceaux favoris
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
