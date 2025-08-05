import { useEffect, useRef,useState } from "react";
import Phaser from "phaser";
import styles from "../styles/phaserGame.module.css"
import { preload,update,create } from "../modules/phaser";








const PhaserGame = () => {
 const gameRef = useRef();


  const [showModal, setShowModal] = useState(false); // 👈 gestion de la modale


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
        game.openModal = () => setShowModal(true);
        game.closeModal = () => setShowModal(false);
      }
    },
      };

    const game = new Phaser.Game(config);

    return () => game.destroy(true);
  }, []);

  return (
  <>
    <div ref={gameRef} className={styles.GameContainer} />
    {showModal && (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2>Bienvenue à Music City !</h2>
          <p>Voici une description ou une action possible...</p>
          <button onClick={() => setShowModal(false)}>Fermer</button>
        </div>
      </div>
    )}
  </>
);
};
export default PhaserGame;