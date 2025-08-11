import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faBarcode } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/scss/Quiz/Header.module.scss";
import { useRouter } from "next/router";
import {leaveApplication} from '../../modules/appinteraction'

function Header({ q }) {
  const router = useRouter();

  const handleLeaveBuilding = () => {
      leaveApplication(router)
  };

  return (
    <header className={styles.header}>
      <button className="button-bulle purple">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <span>Quiz</span>
      <button className="button-bulle pink">
        <FontAwesomeIcon icon={faXmark} onClick={handleLeaveBuilding}/>
      </button>
    </header>
  );
}

export default Header;
