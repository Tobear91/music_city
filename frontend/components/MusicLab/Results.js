import styles from "../styles/Results.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function Results() {
  const storeData = useSelector((state) => state.analyses.value); 

  useEffect(() => {
    console.log('Contenu du store :', storeData);
  }, [storeData]);

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the results!
        </h1>
      </main>
    </div>
  );
}

export default Results;