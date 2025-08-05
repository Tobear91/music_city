import styles from "../../styles/MusicLab/Launch.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  getAlbumTracks,
  newTrackFromSPO,
  getLyrics,
  getGenres,
  getAudioFeatures
} from "../reducers/analyses";

function Launch() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [trackId, setTrackId] = useState("");
  const [token, setToken] = useState("");

  useEffect;
  const client_id = "4e883e65d8104a14ac4a47e8d97cf74e";
  const client_secret = "422c1092bb314117b87d008d14a1aeff";
  const localhost_url = "http://127.0.0.1:3000";

  useEffect(() => {
    async function getTokenSpotify(id, secret) {
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"), //Buffer: binaire; toString(base64) passe en alphanumerique
        },
        body: "grant_type=client_credentials",
      });
      const data = await res.json();
      const token = data.access_token;

      setToken(token);
    }
    getTokenSpotify(client_id, client_secret);
  }, []);

  async function searchTrack(token, query) {
    let res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let data = await res.json();
    console.log(data.tracks.items[0])
    const artiste = data.tracks.items[0].artists[0].name
      .split("(")[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\$/g, "s")
      .replace(/[^a-zà-ÿ0-9]/gi, "");

    const titre = data.tracks.items[0].name
      .split(/-|\(feat/i)[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\$/g, "s")
      .replace(/[^a-zà-ÿ0-9]/g, "");

    const artiste_id = data.tracks.items[0].artists[0].id;

    const track_id = data.tracks.items[0].id;

    dispatch(newTrackFromSPO(data));

    res = await fetch(
      `https://api.spotify.com/v1/albums/${data.tracks.items[0].album.id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    data = await res.json();
    dispatch(getAlbumTracks(data.items));

      //audiofeatures ne fonctionne plus chez spotify
    //   res = await fetch(
    //   `https://api.spotify.com/v1/audio-features/${track_id}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    // data = await res.json();
    // console.log(data)
    // dispatch(getAudioFeatures(data));

    res = await fetch(
      `https://api.spotify.com/v1/artists/${artiste_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    data = await res.json();
    dispatch(getGenres(data.genres));



    res = await fetch(
      `http://localhost:3000/tracks/lyrics?artiste=${artiste}&titre=${titre}`
    );
    data = await res.json();
    dispatch(getLyrics(data.lyrics));

    router.push("/results");
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
            searchTrack(token, trackId);
          }}
        >
          SEARCH TRACK
        </button>
      </main>
    </div>
  );
}

export default Launch;
