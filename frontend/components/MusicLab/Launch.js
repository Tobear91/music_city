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
    let data;
    let res = await getTrackData(query).then((datas) => {
      data = datas;
      return data;
    });

    // console.log(data.tracks.items[0]);
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

    res = await getAlbumDataFromTrackData(data).then((datas) => {
      data = datas;
      return data;
    });

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

    res = await getArtistData(artiste_id).then((datas) => {
      data = datas; return data;
    });

    dispatch(getGenres(data.genres));

    res = await fetch(
      `http://127.0.0.1:3000/tracks/lyrics?artiste=${artiste}&titre=${titre}`
    );
    data = await res.json();
    dispatch(getLyrics(data.lyrics));
    console.log()
    // console.log(data);
    router.push("/musiclab/results");
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
