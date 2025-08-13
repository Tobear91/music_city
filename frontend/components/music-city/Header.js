import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/VinylesStore/Header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { leaveApplication } from "../../modules/appinteraction";

function Header({}) {
  const router = useRouter();
  const handleLeaveBuilding = () => {
    leaveApplication(router);
  };

  return (
    <header className={styles.header}>
      <button className="button-bulle purple">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <span>Bienvenue à Music City</span>

      <button className="button-bulle pink" onClick={handleLeaveBuilding}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </header>
  );
}

export default Header;
