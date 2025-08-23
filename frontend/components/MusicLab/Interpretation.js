import styles from "../../styles/MusicLab/Composants.module.css";
import { useSelector } from "react-redux";
function Interpretation(props) {
  const interpretationState = useSelector(
    (state) => state.analyses.value.interpretation_by_ai.interpretation
  );
  const storeData = useSelector((state) => state.analyses.value);

  //propose un nouveau launch si dislikes > likes
  if (
    storeData.interpretation_by_ai.likes <
    storeData.interpretation_by_ai.dislikes
  ) {
    return (
      <div>
        <h1 className={styles.title}>INTERPRETATION DES PAROLES:</h1>
        <button onClick={() => handleClickNew(storeData.track_id)}>
          Launch
        </button>
      </div>
    );
  }

  //propose de voter si pas déjà fait
  const donnerSonAvis = (dejafait) => {
    if (dejafait) {
      return <div></div>;
    } else {
      return (
        <div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
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
            D'accord({props.likes})
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
            Pas d'accord({props.dislikes})
          </button>
        </div>
      );
    }
  };

  //genere interpretation
  async function handleClick() {
    const result = await props.launchInterpretation();
  }

  //genere nouvelle interpretation et supprime les votes pour cette track
  async function handleClickNew(id) {
    try {
      const res = await fetch("http://127.0.0.1:3000/tracks/removeVoteAll", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.result) {
        console.log("Vote supprimé pour tous les utilisateurs");
      } else {
        console.error("Erreur :", data.error);
      }
    } catch (err) {
      console.error("Fetch error :", err);
    }
    const result = await props.launchInterpretation();
  }

  if (interpretationState) {
    return (
      <div>
        <h1 className={styles.title}>INTERPRETATION DES PAROLES:</h1>
        <div>
          <p>{interpretationState}</p>
        </div>
        <br />
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
