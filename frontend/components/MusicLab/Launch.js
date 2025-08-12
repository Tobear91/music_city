import styles from "../../styles/MusicLab/Launch.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  getAlbumTracks,
  newTrackFromSPO,
  getLyrics,
  getGenres,
  getAudioFeatures,
  getTrackFromDatabase,
} from "../../reducers/analyses";

import {
  getTrackData,
  getArtistData,
  getAlbumDataFromTrackData,
} from "../../modules/spotify";


function Launch() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [trackId, setTrackId] = useState("");

  async function searchTrack(query) {
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
      // console.log("Track already exists in the database:", dbData);
      dispatch(getTrackFromDatabase(dbData));
    } catch (err) {
      console.log(
        "Track not found in the database, adding new track:",
        err.message
      );

      // 2. Ajout de la nouvelle track dans la base de données
      dispatch(newTrackFromSPO(spotifyData));

      // 2.1 Récupération des genres
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
    const lyricsData = await lyricsRes.json();
    dispatch(getLyrics(lyricsData.lyrics));

    // 4. Récupération de l’album et des pistes associées
    const albumData = await getAlbumDataFromTrackData(spotifyData);
    dispatch(getAlbumTracks(albumData.items));

    // 5. Redirection vers la page résultats
    router.push("/MusicLab/results");
  }

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the music Lab!</h1>
        <input
          placeholder="your search"
          onChange={(e) => setTrackId(e.target.value)}
          value={trackId}
        ></input>
        <button
          onClick={() => {
            searchTrack(trackId);
          }}
        >
          SEARCH TRACK
        </button>
      </main>
    </div>
  );
}

export default Launch;
