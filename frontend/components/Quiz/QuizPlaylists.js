import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import Header from "./Header";
import styles from "../../assets/scss/quiz/QuizPlaylists.module.scss";
import { getPlaylistsUser} from "../../modules/spotify";

function QuizPlaylists() {
  const [playlists, setPlaylists] = useState([]);

  const router = useRouter();
  const { q } = router.query;

  //charger les playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getPlaylistsUser();
        setPlaylists(data.items);
      } catch (err) {
        console.error("Erreur lors du chargement des playlists :", err);
      }
    };
    fetchPlaylists();
  }, []);

  // Charger morceaux playlist et générer les questions
  const handlePlaylistQuestions = (playlistId) => {
    if (!playlistId) return;
    router.push(`/quiz/playlist/${playlistId}`);
  }

  // Afficher le quiz si les questions sont prêtes
  return (
    <>
      <Header q={q} />

      <div className={styles.playlistsContainer}>
        <div className={styles.header}>
          <Image
            src="/img/cloudy_moon_nobg.png"
            alt="Bannière"
            width={707}
            height={194}
          />
        </div>
        <div className={styles.playlistsBox}>
          {playlists.length === 0 ? (
            <p>Vous n'avez pas de playlists disponibles.</p>
          ) : (
            playlists.map((playlist) => (
              <button
                key={playlist.id}
                className={"form-button primary"}
                onClick={() => handlePlaylistQuestions(playlist.id)}
              >
                {playlist.name}
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ color: "#fb6ca2" }}
                />
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default QuizPlaylists;
