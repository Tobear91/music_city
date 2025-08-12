import styles from "../../assets/scss/music-city/Home.module.scss";
import Image from "next/image";
import Header from "./Header";
import Card from "./Card";

export default function Homepage() {
  const buildingsInfo = [
    {
      name: "Vinil Store",
      position: "Ouest",
      description: "A définir",
    },
    {
      name: "Serie",
      position: "Sud-est",
      description:
        "En entrant dans se batiment vous pourrez tester vos connaissances musicales des séries lors d'un blindtest de 5 questions",
    },
    {
      name: "Quiz",
      position: "Centre",
      description: "A définir",
    },
    {
      name: "Music lab",
      position: "Nord",
      description: "A définir",
    },
    {
      name: "Home",
      position: "Centre-est",
      description: "En développement",
    },
    {
      name: "Observatory",
      position: "Nord-est",
      description: "En développement",
    },
    {
      name: "Themes",
      position: "Nord-Ouest",
      description: "En développement",
    },
  ];

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
