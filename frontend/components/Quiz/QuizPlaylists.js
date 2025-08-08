import styles from "../../assets/scss/quiz/QuizPlaylists.module.scss";
import { useEffect, useState } from "react";
import { getPlaylistsUser } from "../../modules/spotify";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function QuizPlaylists() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const data = await getPlaylistsUser();
      setPlaylists(data.items);
    };

    fetchPlaylists();
  }, []);

  return (
    <>
      <div className={styles.menuBar}>
        <FontAwesomeIcon
          icon={faCircleXmark}
          className={styles.crossClose}
          style={{ width: "40px", height: "40px" }}
        />
        <div>
          <h1 className={styles.title}>QUIZ</h1>
        </div>
      </div>
      <div className={styles.playlistsContainer}>
        <div className={styles.header}>
          <Image
            src="/img/cloudy_moon.jpg"
            alt="Bannière"
            width={707}
            height={194}
          />
        </div>

        <div className={styles.boxText}>
          <h1>Choisissez parmi vos playlists</h1>
        </div>

        <div className={styles.playlistsBox}>
          {playlists.map((playlist) => (
            <button key={playlist.id} className={styles.playlistButton}>
              {playlist.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default QuizPlaylists;
