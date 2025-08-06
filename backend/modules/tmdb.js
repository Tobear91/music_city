

const TMDB_API_KEY = process.env.TMDB_API_KEY;




const getRandomSeries = async()=>{
    // On va chercher sur les plateformers les plus utilséis en france pour commencer 
    const platforms = [
        { name: 'Netflix', id: 8 },
        { name: 'Prime Video', id: 119 },
        { name: 'HBO', id: 1899 }
    ];
    // selection d'un id aleatoire 

    const platformId = platforms[Math.floor(Math.random() * platforms.length)].id

    // on recherche sur cette plateforme toute les éries avec un score d'au moins 7.5 et au moins 500 votes
    const initialUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&with_watch_providers=${platformId}&watch_region=FR&page=1&without_genres=16&first_air_date.gte=2005-01-01&vote_average.gte=7.5&vote_count.gte=500`

    // on récupere le nombre de page de cette requete et on en selectionne une au hasard

    const firstResponse = await fetch(initialUrl);
    const firstData = await firstResponse.json();
    const totalPages = firstData.total_pages;
    const randomPage = Math.floor(Math.random() * totalPages) + 1;
  
    const finalUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&with_watch_providers=${platformId}&watch_region=FR&page=${randomPage}&without_genres=16&first_air_date.gte=2005-01-01&vote_average.gte=7.5&vote_count.gte=500`;

    const response = await fetch(finalUrl);
    const data = await response.json();
    const shows = data.results;

    const randomShow = shows[Math.floor(Math.random() * shows.length)];


    return randomShow;
    
    

}




module.exports = { getRandomSeries };
