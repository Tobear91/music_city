async function getPreviewWithArtistAndTitle (title, artist) {
  const body = { trackName: title, artistName: artist };
  const previewUrl = await fetch(`http://127.0.0.1:3000/tracks/previewUrl`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => 
  res.json()).then(data => data.previewUrl)
  return previewUrl;
}

module.exports = { getPreviewWithArtistAndTitle };