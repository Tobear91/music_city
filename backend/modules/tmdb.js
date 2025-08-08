
const TMDB_API_KEY = process.env.TMDB_API_KEY;



/* Permet de renvoyer une soundtrack aléatorie depuis tmdb parmi les meilleurs sur les platteformes Netflix, Prime ou HBO*/
const getRandomSeries = async()=>{
    // On va chercher sur les plateformers les plus utilséis en france pour commencer 
    const platforms = [
        { name: 'Netflix', id: 8 },
        { name: 'Prime Video', id: 119 },
        { name: 'HBO', id: 1899 },

    ];
    // selection d'un id aleatoire 

    const randomPlatformIndex = Math.floor(Math.random() * platforms.length);
    const platformId = platforms[randomPlatformIndex].id;
    const platformName = platforms[randomPlatformIndex].name;

    // on recherche sur cette plateforme toute les éries avec un score d'au moins 7.5 et au moins 500 votes
    const initialUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&with_watch_providers=${platformId}&watch_region=FR&page=1&without_genres=16&first_air_date.gte=1990-01-01&first_air_date.lte=2024-12-31&vote_average.gte=7&vote_count.gte=300`


    // on récupere le nombre de page de cette requete et on en selectionne une au hasard

    const firstResponse = await fetch(initialUrl);
    const firstData = await firstResponse.json();
    const totalPages = firstData.total_pages;


    const randomPage = Math.floor(Math.random() * totalPages) + 1;

    const finalUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&with_watch_providers=${platformId}&watch_region=FR&page=${randomPage}&without_genres=16&first_air_date.gte=1990-01-01&first_air_date.lte=2024-12-31&vote_average.gte=7&vote_count.gte=300`;
    const response = await fetch(finalUrl);
    const data = await response.json();

    // toutes les séries de la page puis on en selectionne une au hasard
    const series = data.results;
    const randomSerieIndex = Math.floor(Math.random() * series.length)
    const randomSerie = series[randomSerieIndex];

    // information détaillée du show
    const detailsRes = await fetch(`https://api.themoviedb.org/3/tv/${randomSerie.id}?api_key=${TMDB_API_KEY}&append_to_response=credits`);
    const detailsSerie = await detailsRes.json();

    const serieInformation = {
        title: detailsSerie.name,
        id: detailsSerie.id,
        overview: detailsSerie.overview,
        platform: platformName,
        posterPath: detailsSerie.poster_path
            ? `https://image.tmdb.org/t/p/w300${detailsSerie.poster_path}`
            : null,
        mainActor: detailsSerie.credits.cast[0]?.name || 'Inconnu',
        soundtrack: null,
        previewURL:null,
        trackId:null,
        artistName:null,
        spotifyAlbumName: null,
        isTrackMatchCertain:false,
    }

    return serieInformation;
}






module.exports = { getRandomSeries };
