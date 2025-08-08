import { useEffect, useRef,useState } from "react";
import Phaser from "phaser";
import styles from "../styles/PhaserGame.module.css"
import { preload,update,create } from "../modules/phaser";
import { useSelector,useDispatch } from "react-redux";
import { useRouter } from "next/router";

import EnterScreen from "./globalapp/EnterScren";

const PhaserGame = () => {
    const gameRef = useRef();
    const characterPosition = useSelector((state)=>state.character.position)
    const router = useRouter();
    const [showEnterScreen, setShowEnterScreen] = useState(false);

    useEffect(() => {
    if (characterPosition.name && router.asPath !== `/${characterPosition.name}`) {
      setShowEnterScreen(true);
            setTimeout(() => {
        router.push(`/${characterPosition.name}`);
      }, 1000);

    } else if (!characterPosition.name && router.asPath !== "/") {
      router.push("/");
    }
  }, [characterPosition.name]);


  useEffect(() => {
    // permet de s'adapter à la taiille de l'écran + barre des tâches n'est pas sur la carte 
    const width = window.innerWidth;
    const height = window.innerHeight;

      const config = {
        type: Phaser.AUTO,
        width: width,
        height: height,
        parent: gameRef.current,
        physics: {
          default: 'arcade',
        },
        scene: {
          preload,
          create,
          update,
        },
      };

    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  if (showEnterScreen) {
    return <EnterScreen />;
  }
  return (
    <div ref={gameRef} className={styles.GameContainer} />
    
);
};
export default PhaserGame;