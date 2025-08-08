const cheerio = require("cheerio");

// possible d'utiliser jsdom pour simuler un DOM coté serveur mais cheerio est plus léger et plus rapide pour le scraping - egalement plus safe pour du scraping public car il n'exécute pas de JS

async function scraperLyrics(artiste, titre) {

  // Sécurité supplémentaire: filtre les caractères spéciaux
  if (!/^[a-z0-9]+$/i.test(artiste) || !/^[a-z0-9]+$/i.test(titre)) {
    throw new Error();
  }
  const url = `https://www.azlyrics.com/lyrics/${artiste}/${titre}.html`;
  try {
    // Télécharger le HTML
    const response = await fetch(url);
    const html = await response.text();
    
    // Charger le HTML avec cheerio - creation d'un DOM coté serveur 
    const queryDOM = cheerio.load(html);

    // Sélectionner l'élément souhaité et formater
    const lyrics = queryDOM(
      ".container.main-page .row .col-xs-12.col-lg-8.text-center > div"
    )
      .eq(4)
      .text()
      .trim();
    return lyrics;
  } catch (error) {
    console.error("Erreur lors du scraping :", error.message);
  }
}

module.exports = scraperLyrics;
