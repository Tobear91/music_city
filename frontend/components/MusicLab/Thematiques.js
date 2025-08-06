import styles from "../../styles/MusicLab/Lyrics.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function Thematiques(props) {
  const storeData = useSelector((state) => state.analyses.value); 

  useEffect(() => {
    console.log('Contenu du store :', storeData);
  }, [storeData]);

  return (
    <div>

        <h1>
          THEMATIQUES DE LA CHANSON :
        </h1>

    </div>
  );
}

export default Thematiques;