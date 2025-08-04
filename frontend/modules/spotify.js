import { store } from "./store";
import { setSpotifyToken } from "../reducers/user";

const customFetch = async (url) => {
  const user = store.getState().user.user;

  let options = {
    headers: {
      Authorization: `Bearer ${user.spotify.access_token}`,
    },
  };

  let response = await fetch(url, options);
  let datas = await response.json();

  if (datas.error?.status === 401) {
    const access_token = await refreshToken();
    store.dispatch(setSpotifyToken(access_token));

    let options = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    let response = await fetch(url, options);
    return await response.json();
  } else {
    return datas;
  }
};

const refreshToken = async () => {
  const response = await fetch("http://127.0.0.1:3000/spotify/refresh-token", {
    method: "POST",
    credentials: "include",
  });
  const datas = await response.json();
  return datas.access_token;
};

const getMe = async (token) => {
  const url = "https://api.spotify.com/v1/me";
  return await customFetch(url);
};

const getFollowedArtists = async (token) => {
  const url = "https://api.spotify.com/v1/me/following?type=artist";
  return await customFetch(url);
};

module.exports = { getMe, getFollowedArtists };
