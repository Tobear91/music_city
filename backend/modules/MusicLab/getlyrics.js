const axios = require("axios");
const cheerio = require("cheerio");

async function scraperLyrics(artiste, titre) {
  // Sécurité supplémentaire: filtre les caractères spéciaux
  if (!/^[a-z0-9]+$/i.test(artiste) || !/^[a-z0-9]+$/i.test(titre)) {
    throw new Error;
  }
  const url = `https://www.azlyrics.com/lyrics/${artiste}/${titre}.html`;
  try {
    // Télécharger le HTML
    const response = await axios.get(url);
    const html = response.data;

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



    //Lister les div
    // lyrics.each(function (index, element) {
    //   // 'this' ou 'element' correspond à chaque div dans la sélection
    //   const divText = parsing(this).text().trim();
    //   console.log(`Div #${index + 1} :`, divText);
    // });