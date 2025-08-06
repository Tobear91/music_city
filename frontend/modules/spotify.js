import { store } from "./store";
import { setUser, setSpotifyToken } from "../reducers/user";
import { useRouter } from "next/router";

const customFetch = async (url) => {
  const user = store.getState().user.user;

  const options = {
    headers: {
      Authorization: `Bearer ${user.spotify.access_token}`,
    },
  };

  const response = await fetch(url, options);
  const datas = await response.json();

  // Si le token est expiré on lance le refresh token et on relance le fetch
  if (datas.error?.status === 401) {
    const access_token = await refreshToken(user.spotify.type);
    store.dispatch(setSpotifyToken(access_token));

    const options = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    const response = await fetch(url, options);
    return await response.json();
  } else {
    return datas;
  }
};

const refreshToken = async (type) => {
  const response = await fetch("http://127.0.0.1:3000/spotify/refresh-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
    credentials: "include",
  });

  const datas = await response.json();
  console.log(datas);

  if (!datas.result && datas.logout) {
    const router = useRouter();
    store.dispatch(setUser({}));
    router.push("/connexion");
  } else {
    return datas.access_token;
  }
};

const getMe = async () => {
  const url = "https://api.spotify.com/v1/me";
  return await customFetch(url);
};

const getFollowedArtists = async () => {
  const url = "https://api.spotify.com/v1/me/following?type=artist";
  return await customFetch(url);
};

const getTracksUser = async () => {
  const url = "https://api.spotify.com/v1/me/tracks";
  return await customFetch(url)
}

module.exports = { getMe, getFollowedArtists, getTracksUser };
const getTrackData = async (trackId) => {
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackId)}&type=track&limit=1`;
  return await customFetch(url);
};

const getAlbumDataFromTrackData = async (trackdata) => {
  const url = `https://api.spotify.com/v1/albums/${trackdata.tracks.items[0].album.id}/tracks`;
  return await customFetch(url);
}

const getArtistData = async (artistId) => { 
  const url = `https://api.spotify.com/v1/artists/${artistId}`;
  return await customFetch(url);
}

module.exports = { getMe, getFollowedArtists, getTrackData, getAlbumDataFromTrackData, getArtistData };
