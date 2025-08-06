import styles from "../../styles/MusicLab/Lyrics.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function Lyrics(props) {
  return (
    <div>
      <main>
      <div>
        <p><span>{props.title}</span> - <span>{props.artist}</span> PLAY({props.uri}) ADDTOFAVORITE({props.id}</p>
        </div>
      <div>
        <p>{props.lyrics}</p>
      </div>
      </main>
    </div>
  );
}

export default Lyrics;