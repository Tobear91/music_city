import styles from "../../assets/scss/quiz/QuizPlaylists.module.scss";
import { useEffect, useState } from "react";
import { getPlaylistsUser } from "../../modules/spotify";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { getPlaylistTracks } from "../../modules/spotify";
import { getQuestions } from "./Questions";
import Quiz from "./Quiz";
import { useRouter } from "next/router";
import Header from "./Header";

function QuizPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [questions, setQuestions] = useState([]);

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

  const handlePlaylistTrack = async (playlistId) => {
    try {
      const data = await getPlaylistTracks(playlistId);

      const tracks = data.items
        .map((item) => item.track)
        .filter(
          (track) =>
            track && track.name && track.artists?.[0]?.name && track.album?.name
        );

      if (tracks.length === 0) {
        alert("Cette playlist est vide");
        return;
      }

      const generatedQuestions = getQuestions(tracks);
      setQuestions(generatedQuestions);
    } catch (err) {
      console.error("Erreur lors du chargement des morceaux :", err);
    }
  };

  // Des questions sont prêtes afficher le quiz
  if (questions.length > 0) {
    return <Quiz questions={questions} />;
  }

  return (
    <>
      <Header q={q} />

      <div className={styles.playlistsContainer}>
        <div className={styles.header}>
          <Image
            src="/img/cloudy_moon.jpg"
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
                className={styles.playlistButton}
                onClick={() => handlePlaylistTrack(playlist.id)}
              >
                {playlist.name}
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default QuizPlaylists;
