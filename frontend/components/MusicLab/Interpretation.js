import styles from "../../styles/MusicLab/Album.module.css";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function Interpretation(props) {
  const interpretationState = useSelector(
    (state) => state.analyses.value.interpretation_by_ai.interpretation
  );

  // console.log(interpretationState)
  async function handleClick() {
    const result = await props.launchInterpretation();
    }
  

  if (interpretationState) {
    return (
      <div>
        <h1 className={styles.title}>INTERPRETATION DE LA CHANSON :</h1>
        <div>
          <p>{interpretationState}</p>
        </div>
        <div>
          <h2></h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>INTERPRETATION DE LA CHANSON :</h1>
      <button onClick={() => handleClick()}>Launch</button>
    </div>
  );
}

export default Interpretation;
