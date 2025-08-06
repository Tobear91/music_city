import styles from "../../styles/MusicLab/Album.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function Genres(props) {
  const storeData = useSelector((state) => state.analyses.value);
    useEffect(() => {
    console.log("Contenu du store :", storeData);
  }, [storeData]);

  let genreslist = props.genres.map((genre, index) => (
    <div key={index}>
      <li><span>{genre}</span> <button onClick={() => props.function({genre})}>AddtoCriteres</button></li> 
      </div>))

  return (
    <div>
      <main className={styles.main}>

        <h1 className={styles.title}>Genres Musicaux :</h1>

        <ol>
          {genreslist}
        </ol>

      </main>
    </div>
  );
}

export default Genres;