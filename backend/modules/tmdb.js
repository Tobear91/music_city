const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const PLATFORMS = [
  { name: "Netflix", id: 8 },
  { name: "Prime Video", id: 119 },
  { name: "HBO", id: 1899 },
];

function getRandomPlatform() {
  return PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function fetchFromTMDB(endpoint) {
  const url = `${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Erreur TMDB : ${response.status} - ${response.statusText}`
    );
  }

  return await response.json();
}

async function getRandomSeries() {
  /* 
  Méthodologie de la fonction : 
  - Selection alétoire d'une des trois plateformes les plus connus en france 
  - Récupères le nombre de page des series les plus populaires avec une note d'au moins 7 et 300 votes
  
  */
  try {
    const { id: platformId, name: platformName } = getRandomPlatform();

    const initialData = await fetchFromTMDB(
      `/discover/tv?sort_by=popularity.desc&with_watch_providers=${platformId}&watch_region=FR&without_genres=16&first_air_date.gte=1990-01-01&first_air_date.lte=2024-12-31&vote_average.gte=7&vote_count.gte=300`
    );
    const totalPages = initialData.total_pages;

    if (!totalPages) {
      throw new Error(`Aucune série trouvée pour ${platformName}`);
    }
    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    const pageData = await fetchFromTMDB(
      `/discover/tv?sort_by=popularity.desc&with_watch_providers=${platformId}&watch_region=FR&without_genres=16&first_air_date.gte=1990-01-01&first_air_date.lte=2024-12-31&vote_average.gte=7&vote_count.gte=300&page=${randomPage}`
    );

    const randomSerie = getRandomItem(pageData.results);
    if (!randomSerie) {
      throw new Error(`Aucune série trouvée sur la page ${randomPage}`);
    }
    const details = await fetchFromTMDB(
      `/tv/${randomSerie.id}?append_to_response=credits`
    );

    return {
      title: details.name,
      id: details.id,
      overview: details.overview,
      platform: platformName,
      posterPath: details.poster_path
        ? `https://image.tmdb.org/t/p/w300${details.poster_path}`
        : null,
      mainActor: details.credits.cast[0]?.name || "Inconnu",
      soundtrack: null,
      previewURL: null,
      trackId: null,
      artistName: null,
      spotifyAlbumName: null,
      isTrackMatchCertain: false,
    };
  } catch (error) {
    console.error("Erreur dans getRandomSeries:", error.message);
    return null;
  }
}

module.exports = { getRandomSeries };
