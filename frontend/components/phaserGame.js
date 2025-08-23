import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import styles from "../assets/scss/phaser/phaser.module.scss";
import { preload, update, create } from "../modules/phaser";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import EnterScreen from "./globalapp/EnterScren";
 
const PhaserGame = () => {
  const gameRef = useRef();
  const characterPosition = useSelector((state) => state.character.position);
  const router = useRouter();
  const [showEnterScreen, setShowEnterScreen] = useState(false);

  //check la position du joueur enregistrée dans le local storage (store character)
  useEffect(() => {
    if (
      characterPosition.name &&
      router.asPath !== `/${characterPosition.name}`
    ) {
      setShowEnterScreen(true);
      setTimeout(() => {
        router.push(`/${characterPosition.name}`);
      }, 700);
    } else if (!characterPosition.name && router.asPath !== "/map") {
      router.push("/map");
    }
  }, [characterPosition.name]);

  useEffect(() => {
    let gameInstance;

    if (typeof window !== "undefined") {
      import("phaser").then((Phaser) => {
        const config = {
          type: Phaser.AUTO,
          width: window.innerWidth,
          height: window.innerHeight,
          parent: gameRef.current,
          physics: { default: "arcade" },
          scene: { preload, create, update },
        };

        gameInstance = new Phaser.Game(config);
      });
    }

    // Nettoyage à la destruction du composant
    return () => {
      if (gameInstance) {
        gameInstance.destroy(true);
      }
    };
  }, []);
  if (showEnterScreen) {
    return <EnterScreen />;
  }
  return <div ref={gameRef} className={styles.GameContainer} />;
};
export default PhaserGame;
