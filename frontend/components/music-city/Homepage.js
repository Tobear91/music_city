import React from "react";
import styles from "../../assets/scss/music-city/Home.module.scss";
import Image from "next/image";
import Header from "./Header";

export default function Homepage() {
  return (
    <div className={styles.modalOverlay}>
      <Header></Header>
      <div className={styles.mainContainer}>
        <Image
          src="/img/cloudy_moon.jpg"
          alt="Cloudy Moon"
          width={707}
          height={194}
          priority
        />
        <div className={styles.overlaySection}></div>
      </div>
    </div>
  );
}
