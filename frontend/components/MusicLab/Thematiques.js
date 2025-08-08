import styles from "../../styles/MusicLab/Lyrics.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function Thematiques(props) {
  const thematiquesState = useSelector((state) => state.analyses.value.interpretation_by_ai.themes);

  if(thematiquesState){
    const thematiques = thematiquesState.map((theme, index) => (
    <li key={index}>{theme} <button onClick={() => props.function({genre})}>AddtoCriteres</button></li> 
))
    return (
      <div>
        <h1>
          THEMATIQUES :
        </h1>
        <div>
        <ol>{thematiques}</ol>
        </div>
      </div>
    );
  }

  return (
    <div>
        <h1>
          THEMATIQUES :
        </h1>
        <p>Lancer l'analyse pour voir les thématiques</p>
    </div>
  );
}

export default Thematiques;