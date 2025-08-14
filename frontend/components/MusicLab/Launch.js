import styles from "../../assets/scss/vinyles_store/Connexion.module.scss";
import styles2 from "../../styles/MusicLab/Header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router.js";
import { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";

import { leaveApplication } from "../../modules/appinteraction";

import {
  getAlbumTracks,
  newTrackFromSPO,
  getLyrics,
  getGenres,
  getTrackFromDatabase,
  resetAnalyses,
} from "../../reducers/analyses";

import {
  getTrackData,
  getArtistData,
  getAlbumDataFromTrackData,
  getTracks,
} from "../../modules/spotify";

function Launch() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    //si input vide, on reset liste de suggestion
    if (!query) {
      setSuggestions([]);
      return;
    }

    //aprés 1000ms sans changement, lance la recherche spotify
    const timeoutId = setTimeout(async () => {
      const spotifyData = await getTracks(query);
      if (spotifyData?.tracks?.items) {
        setSuggestions(spotifyData.tracks.items);
      }
    }, 300); // délai

    //clear timeout si query change avant la fin du délai
    return () => clearTimeout(timeoutId);
  }, [query]);

  //fonction principale de recuperation de données
  async function searchTrack(title, artist) {
    console.log(title, artist);
    dispatch(resetAnalyses());
    // 1. Récupération des données Spotify
    let spotifyData = await getTrackData(title, artist);
    const artiste_id = spotifyData.tracks.items[0].artists[0].id;
    console.log(spotifyData);
    const track_id = spotifyData.tracks.items[0].id;

    try {
      // 2. Vérification si la track existe déjà dans la base de donnée
      const res = await fetch(
        `http://127.0.0.1:3000/tracks?track_id=${spotifyData.tracks.items[0].id}`
      );

      if (!res.ok) {
        throw new Error("Track not found in DB");
      }

      const dbData = await res.json();
      //2.1 Si elle existe, l'ajoute au store
      dispatch(getTrackFromDatabase(dbData));
    } catch (err) {
      console.log("Track not found in the database, adding new track:");

      // 2.2 Sinon, ajout de la nouvelle track dans le store
      dispatch(newTrackFromSPO(spotifyData));

      // 3. Récupération des genres
      const artistData = await getArtistData(artiste_id);
      dispatch(getGenres(artistData.genres));
    }

    // 4. Récupération des paroles
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
    if (lyricsData.lyrics.length === 0) {
      const artiste2 = spotifyData.tracks.items[0].artists[0].name
        .split("(")[0]
        .toLowerCase()
        .replace(/[àáâãäåçèéêëìíîïñòóôõöùúûüýÿ]/g, "") // supprime lettres accentuées
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
      console.log(lyricsData);
    }
    dispatch(getLyrics(lyricsData.lyrics));

    // 5. Récupération de l’album et des pistes associées
    const albumData = await getAlbumDataFromTrackData(spotifyData);
    dispatch(getAlbumTracks(albumData.items));

    router.push("/music-lab/results");
  }

  //gestion de la selection d'une suggestion
  const onSelectSuggestion = (track) => {
    setQuery(track.name, track.artists[0].name);
    setSuggestions([]);
    searchTrack(track.name, track.artists[0].name); // lance la recherche au clic
  };

  const handleLeaveBuilding = () => {
    leaveApplication(router);
  };

  return (
    <section className={styles.connexion}>
      <aside>
        <Image
          src="/img/cloudy_moon.jpg"
          alt="Cloudy Moon"
          width={707}
          height={194}
          priority
        />
        <h1>Music Lab</h1>
      </aside>
      <main>
        <div>
          <h2>Bienvenue dans le Music Lab!</h2>
          <p style={{ color: "#2e1b5c" }}>
            Plongez dans l’univers des chansons d’hier et d’aujourd’hui, et
            redécouvrez-les sous un nouvel angle. Ici, chaque morceau devient
            une expérience : analysez ses paroles, explorez ses thèmes, laissez-vous porter
            par vos envies de decouverte et enregistrez vos musiques favorites!
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchTrack(query);
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder="Rechercher un nouveau morceau"
              name="search"
              autoComplete="off"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              value={query}
            ></input>
            {/* Affichage des suggestions */}
            {suggestions.length > 0 && (
              <ul className={styles2.suggestionsList}>
                {suggestions.map((track) => (
                  <li
                    key={track.id}
                    onClick={() => onSelectSuggestion(track)}
                    style={{ cursor: "pointer" }}
                  >
                    {track.name} - {track.artists[0].name}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <button className="button-bulle pink" onClick={handleLeaveBuilding}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </main>
    </section>
  );
}

export default Launch;
