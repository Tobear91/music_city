import { getSoundtrackScore } from "./getSoundtrackScore.js";
import { getAlbum, getFirstTrackAlbum } from "../spotify.js";

export async function fetchRandomShow() {
  // appelle route our récupérer séries aléatoires
  const res = await fetch("http://127.0.0.1:3000/blindtest/randomshow");
  if (!res.ok) throw new Error("Erreur lors de la récupération des séries");
  return res.json();
}

export async function findBestAlbumForSeries(title, platform) {
  //récupèr el'album avec le meilleur score
  const query = `${title} soundtrack`;
  const albums = await getAlbum(query);

  let bestAlbum = null;
  let bestScore = -1;

  for (const album of albums.albums.items) {
    const score = await getSoundtrackScore(album.name, title, platform);
    if (score > bestScore) {
      bestScore = score;
      bestAlbum = album;
    }
  }
  return { bestAlbum, bestScore };
}

export async function getFirstTrack(albumId) {
  //récupère la première track de l'album
  return getFirstTrackAlbum(albumId);
}

export async function getSpotifyPreviewUrl(artistName, trackName) {
  // récupère la preview de la premièr etrack
  const res = await fetch("http://127.0.0.1:3000/blindtest/previewUrl", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ artistName, trackName }),
  });
  if (!res.ok) return null;

  const data = await res.json();
  return data.previewUrl || null;
}

export function buildEnrichedSerie(
  originalSerie,
  firstTrack,
  bestScore,
  previewUrl
) {
  // mise en forme des données pour les enregristrer dans la DB
  return {
    ...originalSerie,
    artistName: firstTrack.artistName,
    soundtrack: firstTrack.trackName,
    trackId: firstTrack.trackId,
    isTrackMatchCertain: bestScore > 25,
    previewURL: previewUrl,
  };
}
