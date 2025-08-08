import { getTopTracksUser } from "../../modules/spotify";

export async function getQuestions() {
  // Mélanger un tableau
  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  try {

    const data = await getTopTracksUser()
    const validTracks = (data.items || []).filter(
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

      const questionType = Math.floor(Math.random() * 7);
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
            question: `À quel album appartient "${track.name}" de ${track.artists[0].name} ?`,
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
            question: `Qui est en featuring sur "${track.name}" de ${track.artists[0].name}?`,
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

        case 4:
          const dateCandidates = shuffleArray([
            track,
            ...shuffledTracks.filter((t) => t.id !== track.id),
          ]).slice(0, 4);

          const mostRecent = dateCandidates.reduce((a, b) =>
            new Date(a.album.release_date) > new Date(b.album.release_date)
              ? a
              : b
          );

          newQuestion = {
            question: `Lequel de ces morceaux est sorti le plus récemment ?`,
            options: dateCandidates.map((t) => t.name),
            correctAnswer: mostRecent.name,
          };
          break;

        case 5:
          const numArtists = track.artists.length;
          const baseOptions = new Set([
            numArtists,
            numArtists + 1,
            Math.max(1, numArtists - 1),
            numArtists + 2,
          ]);
          const artistCountOptions = [...baseOptions].map(String);
          while (artistCountOptions.length < 4)
            artistCountOptions.push("Autre");

          newQuestion = {
            question: `Combien d’artistes sont crédités sur "${track.name}" de ${track.artists[0].name} ?`,
            correctAnswer: String(numArtists),
            options: shuffleArray(artistCountOptions),
          };
          break;

        case 6:
          const albumType = track.album.album_type;
          const albumTypeMap = {
            album: "Album",
            single: "Single",
            compilation: "Compilation",
          };
          const typeOptions = ["Album", "Single", "Compilation"];
          while (typeOptions.length < 4) typeOptions.push("Autre");

          newQuestion = {
            question: `"${track.name}" de ${track.artists[0].name} est issu de quel type de publication ?`,
            correctAnswer: albumTypeMap[albumType] || "Autre",
            options: shuffleArray(typeOptions),
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
