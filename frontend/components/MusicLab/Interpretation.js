import styles from "../../styles/MusicLab/Composants.module.css";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function Interpretation(props) {
  const interpretationState = useSelector(
    (state) => state.analyses.value.interpretation_by_ai.interpretation
  );
  
  const donnerSonAvis = (dejafait) => {
    if (dejafait) {
      return (
        <div>
        </div>
      );
    } else {
      return (<div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
          <p>Êtes-vous d'accord avec cette interpretation?</p>
          <button
            onClick={props.handleLike}
            style={{
              padding: "8px 16px",
              margin: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            D'accord
          </button>

          <button
            onClick={props.handleDislike}
            style={{
              padding: "8px 16px",
              margin: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Pas d'accord
          </button>
        </div>)
    }
  };


  async function handleClick() {
    const result = await props.launchInterpretation();
  }

  if (interpretationState) {
    return (
      <div>
        <h1 className={styles.title}>INTERPRETATION DES PAROLES:</h1>
        <div>
          <p>{interpretationState}</p>
        </div>
        {donnerSonAvis(props.dejafait)}
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>INTERPRETATION DES PAROLES:</h1>
      <button onClick={() => handleClick()}>Launch</button>
    </div>
  );
}

export default Interpretation;
