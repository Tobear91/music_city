const express = require('express');
const router = express.Router();

// Route GET pour récupérer les morceaux likés
router.get('/tracks', async (req, res) => {
  const accessToken = req.headers.authorization

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
  } catch (err) {
    console.error('Erreur lors de l’appel à Spotify :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;