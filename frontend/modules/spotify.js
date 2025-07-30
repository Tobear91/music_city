const getMe = async (token) => {
  const url = "https://api.spotify.com/v1/me";
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(url, options);
  return await response.json();
};

const userTopArtist = async (token) => {
  const url = "https://api.spotify.com/v1/me/top/artists";
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(url, options);
  return await response.json();
};

const getFollowedArtists = async (token) => {
  const url = "https://api.spotify.com/v1/me/following?type=artist";
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(url, options);
  return await response.json();
};

module.exports = { getMe, userTopArtist, getFollowedArtists };
