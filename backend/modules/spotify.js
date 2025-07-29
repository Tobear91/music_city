const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:3000/spotify/callback";

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

const generateUserToken = async (code) => {
  const body = new URLSearchParams();
  body.append("code", code);
  body.append("redirect_uri", REDIRECT_URI);
  body.append("grant_type", "authorization_code");
  return await requestToken(body);
};

module.exports = { requestToken, generateSimpleToken, generateUserToken };
