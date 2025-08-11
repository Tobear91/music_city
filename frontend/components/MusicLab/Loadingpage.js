import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../../assets/scss/blindtest/LoadingScreens.module.scss"; 

export default function LoadingScreens() {
  const [frame, setFrame] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Animation des frames
    const frameInterval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 3);
    }, 150);

    // Navigation après 500 ms
    const timeout = setTimeout(() => {
      router.push("/MusicLab/results");
    }, 500);

    // Cleanup
    return () => {
      clearInterval(frameInterval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.main}>
        <div className={styles.characters}>
          <Image
            src={`/img/loading_screen/player1_loading${frame + 1}.png`}
            alt="Perso 1"
            width={100}
            height={150}
            className={styles.character}
          />
        </div>
        <h1 className={styles.titlePage}>Chargement...</h1>
      </div>
    </div>
  );
}