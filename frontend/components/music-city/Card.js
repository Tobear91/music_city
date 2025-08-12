import styles from "../../assets/scss/music-city/Card.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";

function Card({ name, position, description }) {
  return (
    <div className={styles.cardContainer}>
      <h2 className={styles.subtitle}>{name}</h2>
      <p className={styles.description}>{description}</p>
      <p className={styles.localisation}>
        <FontAwesomeIcon icon={faLocationCrosshairs} />
        {position}
      </p>
    </div>
  );
}

export default Card;
