const express = require('express');
const router = express.Router();

// Route pour récupérer les morceaux likés de l'utilisateur
router.get('/tracks', async (req, res) => {
  const accessToken = req.body.spotifyAccessToken;  

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token manquant' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de l’appel à Spotify :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/playlists', async (req, res) => {
  const accessToken = req.body.spotifyAccessToken;  

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token manquant' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de l’appel à Spotify :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;