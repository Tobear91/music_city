const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const requestToken = async (body) => {
  const authHeader = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const url = "https://accounts.spotify.com/api/token";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authHeader}`,
    },
    body,
  };

  const response = await fetch(url, options);
  return await response.json();
};

const generateSimpleToken = async () => {
  const body = new URLSearchParams();
  body.append("grant_type", "client_credentials");
  return await requestToken(body);
};

module.exports = { requestToken, generateSimpleToken };
