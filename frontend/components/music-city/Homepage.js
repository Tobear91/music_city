import styles from "../../assets/scss/music-city/Home.module.scss";
import Image from "next/image";
import Header from "./Header";
import Card from "./Card";
import { buildingsInfo } from "./buildingsInfo";

export default function Homepage() {
  const buildingDescription = buildingsInfo.map((building, i) => {
    return (
      <Card
        name={building.name}
        position={building.position}
        description={building.description}
      ></Card>
    );
  });
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
        <div className={styles.overlaySection}>{buildingDescription}</div>
      </div>
    </div>
  );
}
