

export function getSoundtrackScore (album,serieName,platformName){

    // const name = album.name.toLowerCase().trim();
    const name = album.toLowerCase().trim();
    const serie = serieName.toLowerCase().trim().split(':')[0];


    const platformLower = platformName.toLowerCase();
            
    let score = 0;
    if (name.startsWith(serie)) score += 10;
    if (name.includes(platformLower)) score += 5;


    const serieWords = serie.split(' ').filter(word => word.length > 2); // Ignorer les mots très courts
    const nameWords = name.split(' ');
    let matchingWords = 0;
    for (const serieWord of serieWords) {
        if (nameWords.some(nameWord => nameWord.includes(serieWord) || serieWord.includes(nameWord))) {
            matchingWords++;
        }}


    // Score proportionnel au nombre de mots correspondants
    const wordMatchRatio = matchingWords / serieWords.length;
    if (name.includes(serie)) score += 30;
    else if (wordMatchRatio >= 0.8) score += 20; // 80% des mots correspondent
    else if (wordMatchRatio >= 0.6) score += 15; // 60% des mots correspondent
    else if (wordMatchRatio >= 0.4) score += 10; // 40% des mots correspondent

    if (name.includes('original')) score += 2;
    if (name.includes('soundtrack')) score += 2;
    if (name.includes('ost')) score += 3;
    if (name.includes('official')) score += 3;

    // Penalités pour les résultats non pertinents
    if (name.includes('karaoke')) score -= 5;
    if (name.includes('covers')) score -= 5;
    if (name.includes('tribute')) score -= 5;
    if (name.includes('instrumental')) score -= 5;
    if (name.includes('season')) score -= 3;
    
    
    return score
}