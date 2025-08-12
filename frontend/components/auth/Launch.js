import React from "react";
import styles from "../../assets/scss/auth/Launch.module.scss";
import { useRouter } from "next/router.js";
import { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Launch() {
  const router = useRouter();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLaunchGame = () => {
    router.push("/connexion");
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      audioRef.current.volume = 0.05;
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalTitle}>
          <Image
            src="/img/cloudy_moon.jpg"
            alt="Cloudy Moon"
            width={707}
            height={194}
            priority
          />
          <h1 className={styles.titlePage}>Music City</h1>
        </div>
        <div className={styles.modalTxt}>
          <audio ref={audioRef} src="/music/lauch_music.mp3" loop autoPlay />

          <FontAwesomeIcon
            icon={faMusic}
            style={{
              width: "40px",
              height: "40px",
              cursor: "pointer",
              color: isPlaying ? "#fb6ca2" : "#2e1b5c",
              position: "fixed",
              top: "40px",
              right: "80px",
              zIndex: 1000,
            }}
            onClick={toggleMusic}
          />
          <button className={"form-button primary"} onClick={handleLaunchGame}>
            Entrer dans Music City
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </>
  );
}
