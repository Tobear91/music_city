import styles from "../../styles/MusicLab/Album.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function Interpretation(props) {
  const storeData = useSelector((state) => state.analyses.value); 

  useEffect(() => {
    console.log('Contenu du store :', storeData);
  }, [storeData]);

  return (
    <div>

        <h1 className={styles.title}>
          INTERPRETATION DE LA CHANSON :
        </h1>

    </div>
  );
}

export default Interpretation;