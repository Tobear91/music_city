import styles from "../../styles/MusicLab/Composants.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function Genres(props) {
  let genreslist = props.genres.map((genre, index) => (
    <li key={index}>
      <span>{genre}</span>
      <button
        onClick={() => props.function({ genre })}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginLeft: "8px",
          color: "#6200ee", // violet par exemple
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </li>
  ));

  return (
    <div>
      <h1 className={styles.title}>GENRES MUSICAUX :</h1>
      <ol>{genreslist}</ol>
    </div>
  );
}

export default Genres;
