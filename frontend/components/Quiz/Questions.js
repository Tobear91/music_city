//mélanger un tableau
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Mélanger les questions et en garder 10
export const myQuestions = shuffleArray([
  // Par artistes
  {
    question: "Qui chante 'Dynamite' ?",
    options: ["BTS", "Blackpink", "Twice", "EXO"],
    correctAnswer: "BTS",
    
  },
  {
    question: "Quel artiste a sorti 'Levitating' ?",
    options: ["Dua Lipa", "Doja Cat", "Ariana Grande", "Billie Eilish"],
    correctAnswer: "Dua Lipa",
    
  },
  {
    question: "Qui chante 'Thriller' ?",
    options: ["Prince", "Michael Jackson", "Stevie Wonder", "James Brown"],
    correctAnswer: "Michael Jackson",
    
  },
  
  // Albums
  {
    question: "De quel album provient 'Bohemian Rhapsody' ?",
    options: ["A Night at the Opera", "News of the World", "The Game", "Jazz"],
    correctAnswer: "A Night at the Opera",
    
  },
  {
    question: "Quel est l'album de debut de Billie Eilish ?",
    options: ["When We All Fall Asleep, Where Do We Go?", "Happier Than Ever", "dont smile at me", "Guitar Songs"],
    correctAnswer: "When We All Fall Asleep, Where Do We Go?",

  },
  {
    question: "Dans quel album trouve-t-on 'Shape of You' ?",
    options: ["÷ (Divide)", "× (Multiply)", "+ (Plus)", "= (Equals)"],
    correctAnswer: "÷ (Divide)",
    
  },

  // Années de sortie
  {
    question: "En quelle année 'Thriller' de Michael Jackson est-il sorti ?",
    options: ["1982", "1983", "1981", "1984"],
    correctAnswer: "1982",
  },
  {
    question: "Quelle chanson de The Weeknd est sortie en 2019 ?",
    options: ["Blinding Lights", "Starboy", "The Hills", "Can't Feel My Face"],
    correctAnswer: "Blinding Lights",
    
  },
  {
    question: "En quelle décennie 'Stayin' Alive' des Bee Gees est-il sorti ?",
    options: ["1970s", "1980s", "1960s", "1990s"],
    correctAnswer: "1970s",
    
  },

  // Questions sur la durée des morceaux
  {
    question: "Quelle chanson dure approximativement 6 minutes ?",
    options: ["Bohemian Rhapsody - Queen", "Shape of You - Ed Sheeran", "Bad Guy - Billie Eilish", "Dynamite - BTS"],
    correctAnswer: "Bohemian Rhapsody - Queen",
    
  },
  {
    question: "Parmi ces morceaux, lequel est le plus court (environ 2min30) ?",
    options: ["Bad Guy - Billie Eilish", "Thriller - Michael Jackson", "Bohemian Rhapsody - Queen", "Hotel California - Eagles"],
    correctAnswer: "Bad Guy - Billie Eilish",
    
  },

  // Questions sur les genres musicaux
  {
    question: "Quel genre musical correspond le mieux à 'Stayin' Alive' ?",
    options: ["Disco", "Rock", "Pop", "Funk"],
    correctAnswer: "Disco",
    
  },
  {
    question: "BTS appartient principalement à quel genre ?",
    options: ["K-Pop", "J-Pop", "Pop", "Hip-Hop"],
    correctAnswer: "K-Pop",
    
  },
  {
    question: "Quel genre caractérise le mieux Eminem ?",
    options: ["Hip-Hop/Rap", "Pop", "Rock", "R&B"],
    correctAnswer: "Hip-Hop/Rap",
    
  },

  // Questions sur la popularité/charts
  {
    question: "Quelle chanson a atteint le #1 au Billboard Hot 100 en 2020 ?",
    options: ["Blinding Lights - The Weeknd", "Drivers License - Olivia Rodrigo", "As It Was - Harry Styles", "Bad Guy - Billie Eilish"],
    correctAnswer: "Blinding Lights - The Weeknd",
    
  },
  {
    question: "Quel artiste a eu le plus de streams sur Spotify en 2021 ?",
    options: ["Bad Bunny", "Taylor Swift", "BTS", "Drake"],
    correctAnswer: "Bad Bunny",
    
  },

  // Questions sur les collaborations
  {
    question: "Qui collabore avec Dua Lipa sur 'Cold Heart' ?",
    options: ["Elton John", "Ed Sheeran", "Calvin Harris", "The Weeknd"],
    correctAnswer: "Elton John",
    
  },
  {
    question: "Lady Gaga a collaboré avec quel artiste sur 'Rain on Me' ?",
    options: ["Ariana Grande", "Beyoncé", "Taylor Swift", "Dua Lipa"],
    correctAnswer: "Ariana Grande",
    
  },

  // Questions sur les caractéristiques audio (danceability, energy, etc.)
  {
    question: "Parmi ces morceaux, lequel a le plus haut niveau de 'danceability' ?",
    options: ["Levitating - Dua Lipa", "Someone Like You - Adele", "Bohemian Rhapsody - Queen", "Hello - Adele"],
    correctAnswer: "Levitating - Dua Lipa",
    
  },
  {
    question: "Quel morceau a un niveau d'énergie élevé ?",
    options: ["Dynamite - BTS", "Someone Like You - Adele", "The Sound of Silence - Simon & Garfunkel", "Mad World - Gary Jules"],
    correctAnswer: "Dynamite - BTS",
    
  },

  // Questions sur les labels/maisons de disques
  {
    question: "Sur quel label Queen a-t-il sorti ses premiers albums ?",
    options: ["EMI", "Warner Bros", "Universal", "Sony"],
    correctAnswer: "EMI",
  },
  {
    question: "BTS est signé sur quel label ?",
    options: ["Big Hit Entertainment", "SM Entertainment", "YG Entertainment", "JYP Entertainment"],
    correctAnswer: "Big Hit Entertainment",
  },

  // Questions sur les certifications
  {
    question: "Combien de fois 'Shape of You' a-t-il été certifié platine aux États-Unis ?",
    options: ["11x Platine", "5x Platine", "3x Platine", "Diamant"],
    correctAnswer: "11x Platine",
  },

  // Questions sur les instruments principaux
  {
    question: "Quel instrument Ed Sheeran utilise-t-il principalement en live ?",
    options: ["Guitare acoustique", "Piano", "Guitare électrique", "Ukulélé"],
    correctAnswer: "Guitare acoustique",
  },
  {
    question: "Freddie Mercury était principalement :",
    options: ["Chanteur et pianiste", "Guitariste", "Bassiste", "Batteur"],
    correctAnswer: "Chanteur et pianiste",
  },

  // Récompenses
  {
    question: "Combien de Grammy Awards Adele a-t-elle remportés pour '21' ?",
    options: ["6", "4", "8", "2"],
    correctAnswer: "6",
  },
  {
    question: "Quel artiste a remporté le Grammy de l'Album de l'année en 2021 ?",
    options: ["Taylor Swift (folklore)", "Dua Lipa (Future Nostalgia)", "Post Malone (Hollywood's Bleeding)", "Harry Styles (Fine Line)"],
    correctAnswer: "Taylor Swift (folklore)",
  }
]).slice(0, 10);