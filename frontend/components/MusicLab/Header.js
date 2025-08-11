import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBars,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/MusicLab/Header.module.scss";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  getAlbumTracks,
  newTrackFromSPO,
  getLyrics,
  getGenres,
  getAudioFeatures,
  getTrackFromDatabase,
  resetAnalyses,
} from "../../reducers/analyses";

import {
  getTrackData,
  getArtistData,
  getAlbumDataFromTrackData,
} from "../../modules/spotify";

function Header(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [trackIdHeader, setTrackIdHeader] = useState("");



  async function searchTrack(query) {

    dispatch(resetAnalyses());
    // 1. Récupération des données Spotify
    let spotifyData = await getTrackData(query);
    const artiste_id = spotifyData.tracks.items[0].artists[0].id;
    const track_id = spotifyData.tracks.items[0].id;

    try {
      // 2. Vérification si la track existe déjà dans la base locale
      const res = await fetch(
        `http://127.0.0.1:3000/tracks?track_id=${spotifyData.tracks.items[0].id}`
      );

      if (!res.ok) {
        throw new Error("Track not found in DB");
      }

      const dbData = await res.json();
      dispatch(getTrackFromDatabase(dbData));
    } catch (err) {
      console.log(
        "Track not found in the database, adding new track:",
        err.message
      );

      // 2.1 Ajout de la nouvelle track dans la base de données
      dispatch(newTrackFromSPO(spotifyData));

      // 2.2 Récupération des genres
      const artistData = await getArtistData(artiste_id);
      dispatch(getGenres(artistData.genres));
    }

    // 3. Récupération des paroles
    const artiste = spotifyData.tracks.items[0].artists[0].name
      .split("(")[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\$/g, "s")
      .replace(/[^a-zà-ÿ0-9]/gi, "");

    const titre = spotifyData.tracks.items[0].name
      .split(/-|\(feat/i)[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\$/g, "s")
      .replace(/[^a-zà-ÿ0-9]/g, "");

    const lyricsRes = await fetch(
      `http://127.0.0.1:3000/tracks/lyrics?artiste=${artiste}&titre=${titre}`
    );
    let lyricsData = await lyricsRes.json();
     console.log(lyricsData)
    if(lyricsData.lyrics.length===0){
 const artiste2 = spotifyData.tracks.items[0].artists[0].name
  .split("(")[0]
  .toLowerCase()
  .replace(/[àáâãäåçèéêëìíîïñòóôõöùúûüýÿ]/g, "")  // supprime lettres accentuées
  .replace(/\$/g, "s")
  .replace(/[^a-z0-9]/g, "");

const titre2 = spotifyData.tracks.items[0].name
  .split(/-|\(feat/i)[0]
  .toLowerCase()
  .replace(/[àáâãäåçèéêëìíîïñòóôõöùúûüýÿ]/g, "")
  .replace(/\$/g, "s")
  .replace(/[^a-z0-9]/g, "");

    const lyricsRes2 = await fetch(
      `http://127.0.0.1:3000/tracks/lyrics?artiste=${artiste2}&titre=${titre2}`
    );
    lyricsData = await lyricsRes2.json();
    console.log(lyricsData)
    }
    dispatch(getLyrics(lyricsData.lyrics));

    // 4. Récupération de l’album et des pistes associées
    const albumData = await getAlbumDataFromTrackData(spotifyData);
    dispatch(getAlbumTracks(albumData.items));
  
    router.push("/MusicLab/loadingpage");
  }

  return (
    <header className={styles.header}>
      <button className="button-bulle purple">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <span>Music Lab</span>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchTrack(trackIdHeader);
        }}
      >
        <input
          type="text"
          className="form-input"
          placeholder="Rechercher un nouveau morceau"
          name="search"
          autoComplete="off"
          onChange={(e) => setTrackIdHeader(e.target.value)}
          value={trackIdHeader}
        ></input>
        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
      <button className="button-bulle pink">
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </header>
  );
}

export default Header;
