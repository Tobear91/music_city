export function getQuestions(tracks) {
  // Mélanger un tableau
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  // Filtrer uniquement les morceaux valides (nom, artiste principal, nom de l’album)
  const validTracks = tracks.filter(
    (track) => track?.name && track.artists?.[0]?.name && track.album?.name
  );
  const shuffledTracks = shuffle(validTracks);

  // Générer des réponse dont une bonne. Set pour eviter les doublons
  const generateAnswers = (correct, type, currentTrack) => {
    const options = new Set([correct]);
    const maxAttempts = 20;
    let attempts = 0;
    while (options.size < 4 && attempts < maxAttempts) {
      attempts++;
      const randomTrack =
        shuffledTracks[Math.floor(Math.random() * shuffledTracks.length)];
      if (randomTrack.id === currentTrack.id) continue;

      let potentialOption = "";
      if (type === "artist") potentialOption = randomTrack.artists[0]?.name;
      else if (type === "album") potentialOption = randomTrack.album?.name;
      else if (type === "title") potentialOption = randomTrack.name;
      else if (type === "year")
        potentialOption = randomTrack.album.release_date?.split("-")[0];

      if (potentialOption && !options.has(potentialOption))
        options.add(potentialOption);
    }
    //Finalisation de la liste d’options, si moins de 4 réponses, ajoute "Autre"
    const tempOptions = [...options];
    while (tempOptions.length < 4) tempOptions.push("Autre");
    return shuffle(tempOptions);
  };

  //  Générateurs de question par type, un par 'case'

  // Trouver l’artiste principal
  const qArtist = (track) => ({
    question: `Qui est l'artiste principal de "${track.name}" ?`,
    correctAnswer: track.artists[0].name,
    options: generateAnswers(track.artists[0].name, "artist", track),
  });

  // Trouver l’album du morceau
  const qAlbum = (track) => ({
    question: `À quel album appartient "${track.name}" de ${track.artists[0].name} ?`,
    correctAnswer: track.album.name,
    options: generateAnswers(track.album.name, "album", track),
  });

  // Trouver les featuring du titre
  const qFeat = (track) => {
    const hasFeature = track.artists.length > 1;
    const correctFeat = hasFeature ? track.artists[1].name : "Aucun";
    const featOptions = hasFeature
      ? generateAnswers(correctFeat, "artist", track)
      : ["Aucun", ...generateAnswers("Autres", "artist", track).slice(1)];
    while (featOptions.length < 4) featOptions.push("Autre");
    return {
      question: `Qui est en featuring sur "${track.name}" de ${track.artists[0].name} ?`,
      correctAnswer: correctFeat,
      options: shuffle(featOptions),
    };
  };

  // Trouver l’année de sortie
  const qYear = (track) => {
    const releaseYear = track.album.release_date?.split("-")[0];
    const yearOptions = new Set([releaseYear]);
    const currentYear = new Date().getFullYear();
    while (yearOptions.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const fakeYear = String(Number(releaseYear) + offset);
      if (+fakeYear > 1960 && +fakeYear <= currentYear)
        yearOptions.add(fakeYear);
    }
    return {
      question: `En quelle année est sorti "${track.name}" de ${track.artists[0].name} ?`,
      correctAnswer: releaseYear,
      options: shuffle([...yearOptions]),
    };
  };

  // Trouver le morceau le plus récent
  const qMostRecent = (track) => {
    const dateCandidates = shuffle([
      track,
      ...shuffledTracks.filter((t) => t.id !== track.id),
    ]).slice(0, 4);
    const mostRecent = dateCandidates.reduce((a, b) =>
      new Date(a.album.release_date) > new Date(b.album.release_date) ? a : b
    );
    return {
      question: `Lequel de ces morceaux est sorti le plus récemment ?`,
      options: dateCandidates.map((t) => t.name),
      correctAnswer: mostRecent.name,
    };
  };

  // Trouver combien d’artistes sont présents
  const qArtistCount = (track) => {
    const numArtists = track.artists.length;
    let artistOptions = [
      numArtists,
      numArtists + 1,
      Math.max(1, numArtists - 1),
      numArtists + 2,
      "Autre",
    ];
    while (new Set(artistOptions).size < 4)
      artistOptions.push(Math.floor(Math.random() * 5) + 1);
    artistOptions = [...new Set(artistOptions)].slice(0, 4).map(String);
    return {
      question: `Combien d’artistes sont crédités sur "${track.name}" de ${track.artists[0].name} ?`,
      correctAnswer: String(numArtists),
      options: shuffle(artistOptions),
    };
  };

  // Trouver le type d’album
  const qAlbumType = (track) => {
    const albumType = track.album.album_type; // "album", "single", "compilation"
    const typeOptions = ["Album", "Single", "Compilation"];
    return {
      question: `"${track.name}" de ${track.artists[0].name} est issu de quel type de publication ?`,
      correctAnswer: albumType.charAt(0).toUpperCase() + albumType.slice(1),
      options: shuffle(typeOptions),
    };
  };

  // Trouver le titre à partir de la pochette
  const qCoverTitle = (track) => ({
    question: `Quel est le titre de ce morceau ?`,
    image: track.album.images[0]?.url || null,
    correctAnswer: track.name,
    options: generateAnswers(track.name, "title", track),
  });

  const questions = [];
  // Génère un total de 10 questions
  for (let i = 0; questions.length < 10; i++) {
    const index = i < shuffledTracks.length ? i : i % shuffledTracks.length;
    const track = shuffledTracks[index];
    
    // Selection parmis les 8 types de questions aléatoirement
    const questionType = Math.floor(Math.random() * 8); 
    let newQuestion;

    switch (questionType) {
      case 0:
        newQuestion = qArtist(track);
        break;
      case 1:
        newQuestion = qAlbum(track);
        break;
      case 2:
        newQuestion = qFeat(track);
        break;
      case 3:
        newQuestion = qYear(track);
        break;
      case 4:
        newQuestion = qMostRecent(track);
        break;
      case 5:
        newQuestion = qArtistCount(track);
        break;
      case 6:
        newQuestion = qAlbumType(track);
        break;
      case 7:
        newQuestion = qCoverTitle(track);
        break;
      default:
        continue;
    }
    questions.push(newQuestion);
  }
  // On garde 10 questions et on les mélanges
  return shuffle(questions.slice(0, 10));
}
