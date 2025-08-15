function addToFavorites(track_id, email, title, artist, uri, duration_ms) {
  const body = {
    track_id: track_id,
    email: email,
    title: title,
    artist: artist,
    spotify_uri: uri,
    duration_ms: duration_ms
  };
  
  fetch(`http://127.0.0.1:3000/users/addtofavorites`, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        return console.log("Erreur lors de la mise a jour des favoris")
      }
      console.log(track_id, email)
      return res.json();
    })
}


function getFavorites(email) {
  const body = { email: email };
  return fetch(`http://127.0.0.1:3000/users/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then(res => {
      if (!res.ok) {
        console.log("Erreur lors de la récupération des favoris");
        return null;
      }
      return res.json();
    })
    .catch(err => {
      console.error("Erreur fetch favorites:", err);
      return null;
    });
}

function removeFromFavorites(track_id, email) {
  const body = {
    track_id: track_id,
    email: email,
  };

  fetch(`http://127.0.0.1:3000/users/removefromfavorites`, {
    method: "POST", // ou "PUT" selon ton API
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
       return console.log("Erreur lors de la suppression")
      }
      return res.json();
    })
}

module.exports = { addToFavorites, getFavorites, removeFromFavorites };