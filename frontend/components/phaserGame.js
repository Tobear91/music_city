import { useEffect, useRef,useState } from "react";
import Phaser from "phaser";
import styles from "../styles/PhaserGame.module.css"
import { preload,update,create } from "../modules/phaser";
import BlindtestHome from "./BlindTest/BlindtestHome";

const PhaserGame = () => {
 const gameRef = useRef();


  const [showModalSerie, setShowModalSerie] = useState(false); //gestion de la modale


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
    callbacks: {
      preBoot: (game) => {
        // Injecte les fonctions React dans l'instance Phaser
        game.openModal = () => setShowModalSerie(true);
        game.closeModal = () => setShowModalSerie(false);
      }
    },
      };

    const game = new Phaser.Game(config);

    return () => game.destroy(true);
  }, []);

  return (
  <>
    <div ref={gameRef} className={styles.GameContainer} />
    {showModalSerie && (
      <BlindtestHome onClose={() => setShowModalSerie(false)}></BlindtestHome>
    )}
  </>
);
};
export default PhaserGame;