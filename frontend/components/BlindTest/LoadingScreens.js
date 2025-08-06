import React from 'react';
import Image from "next/image";
import styles from "../../assets/scss/blindtest/LoadingScreens.module.scss";
import { useState,useEffect } from 'react';


export default function LoadingScreens(){

    const [frame, setFrame] = useState(0);
  
  // permet d'alterner les nombres 0,1 et 2 avec un interval de 200ms
  useEffect(() => {
   setInterval(() => {
      setFrame((prev) => (prev + 1) % 3); 
    }, 150)
  }, []);
    return (
    <div className={styles.modalOverlay}>
        <div className={styles.main}>
            <div className={styles.characters}>
                <Image src={`/img/loading_screen/player1_loading${frame+1}.png`} alt="Perso 1" width={100} height={150}className={styles.character} />
            </div>
            <h1 className={styles.titlePage}> Chargement... </h1>
        </div>

    </div>)
}