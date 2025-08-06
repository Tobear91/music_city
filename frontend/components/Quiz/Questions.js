export async function getQuestions(spotifyAccessToken) {
  // Fonction pour mélanger
  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  try {

    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=50`,
      {
        headers: { Authorization: `Bearer ${spotifyAccessToken}` },
      }
    );

    const { items: tracks } = await response.json();

    // garde les tracks qui ont un nom, un artiste et un nom d'album valide
    const validTracks = tracks.filter(
      (track) => track?.name && track.artists?.[0]?.name && track.album?.name
    );

    const shuffledTracks = shuffleArray(validTracks);

    // générer 4 options de choix
    const generateAnswers = (correct, type, currentTrack) => {
      const options = new Set([correct]);
      const maxAttempts = 20;
      let attempts = 0;

      while (options.size < 4 && attempts < maxAttempts) {
        attempts++;
        const randomTrack =
          shuffledTracks[Math.floor(Math.random() * shuffledTracks.length)];
        if (randomTrack.id === currentTrack.id) continue;

        let potentialOption;
        switch (type) {
          case "artist":
            potentialOption = randomTrack.artists[0]?.name;
            break;
          case "album":
            potentialOption = randomTrack.album?.name;
            break;
          case "title":
            potentialOption = randomTrack.name;
            break;
          case "year":
            potentialOption = randomTrack.album.release_date?.split("-")[0];
            break;
          default:
            potentialOption = "";
        }

        if (potentialOption && !options.has(potentialOption)) {
          options.add(potentialOption);
        }
      }

      const optionsArray = [...options];
      while (optionsArray.length < 4) {
        optionsArray.push("Autre");
      }

      return shuffleArray(optionsArray);
    };

    const questions = [];
    const usedTrackIds = new Set();

    // Parcourir les tracks jusqu'à générer 10 questions max
    for (let i = 0; i < shuffledTracks.length && questions.length < 10; i++) {
      const track = shuffledTracks[i];
      if (usedTrackIds.has(track.id)) continue;
      usedTrackIds.add(track.id);

      const questionType = Math.floor(Math.random() * 4);
      let newQuestion;

      switch (questionType) {
        case 0:
          newQuestion = {
            question: `Qui est l'artiste principal de "${track.name}" ?`,
            correctAnswer: track.artists[0].name,
            options: generateAnswers(track.artists[0].name, "artist", track),
          };
          break;

        case 1:
          newQuestion = {
            question: `À quel album appartient "${track.name}" ?`,
            correctAnswer: track.album.name,
            options: generateAnswers(track.album.name, "album", track),
            image: track.album.images[0]?.url,
          };
          break;

        case 2:
          const hasFeature = track.artists.length > 1;
          const correctFeat = hasFeature ? track.artists[1].name : "Aucun";
          const featOptions = hasFeature
            ? generateAnswers(correctFeat, "artist", track)
            : ["Aucun", ...generateAnswers("Autres", "artist", track).slice(1)];

          while (featOptions.length < 4) featOptions.push("Autre");

          newQuestion = {
            question: `Qui est en featuring sur "${track.name}" ?`,
            correctAnswer: correctFeat,
            options: shuffleArray(featOptions),
          };
          break;

        case 3:
          newQuestion = {
            question: `"${track.name}" de ${track.artists[0].name} est considéré comme populaire ?`, 
            correctAnswer: track.popularity > 70 ? "Vrai" : "Faux", // plus de 70%
            options: ["Vrai", "Faux"],
          };
          break;

        default:
          continue;
      }

      questions.push(newQuestion);
    }

    return shuffleArray(questions.slice(0, 10));
  } catch (error) {
    console.error("Erreur de génération du quiz:", error);
    return [];
  }
}
