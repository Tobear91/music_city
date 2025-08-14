const OpenAI = require("openai");

async function interpreterParoles(paroles, artiste) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });  const prompt = 
// `Un expert en sémantique et un expert en culture musicale discutent pour analyser les paroles ci-dessous et comprendre leur sens global.

// Artiste : """${artiste}"""
// Paroles : """${paroles}"""

// Méthode d'analyse :
// 1. Identifier 2 à 4 grandes idées majeures dans les paroles (concepts ou messages clés).
// 2. Pour chaque grande idée, choisir 1 à 2 thèmes pertinents dans la liste fournie.
// 3. Les thèmes doivent venir du sens global de l'idée, pas d'un mot isolé.
// 4. À la fin, fusionner toutes les idées en une interprétation synthétique (max. 3 phrases).
// 5. Regrouper tous les thèmes trouvés, sans doublon, dans l'ordre d'importance.

// Liste des thèmes autorisés :
// ["amour", "rupture", "espoir", "désir", "tristesse", "rébellion", "confiance en soi", "liberté", "nostalgie", "joie", "injustice", "amitié", "famille", "spiritualité", "voyage", "societe", "temps", "rêve", "mort", "humour", "philosophie", "identité", "succès", "fête"]

// Format de sortie :
// Répondre uniquement avec du JSON valide, sans texte avant ou après :
// {
//   "interpretation": "texte synthétique",
//   "themes": ["thème1", "thème2", "thème3", ...]
// }`
// `

`Tu es un expert en analyse de paroles de chansons.

Artiste: """${artiste}"""
Paroles: """${paroles}"""

Objectif :
1. Donner une interprétation synthétique du sens global (extraits permis, mais concis).
2. Identifier 2 à 5 thèmes pertinents dans la liste.


Règles de sélection :
- Éviter de choisir un thème sur un mot isolé : analyser le sens global.
- Tous les noms en français, minuscules, singulier.
- Ne pas inventer de thèmes 

Liste des thèmes :
["amour", "rupture", "espoir", "désir", "tristesse", "rébellion", "confiance en soi", "liberté", "nostalgie", "joie", "injustice", "amitié", "famille", "spiritualité", "voyage", "societe", "temps", "rêve", "mort", "humour", "philosophie", "fête", "succès"]


Format de sortie (uniquement JSON valide, sans texte autour) :
{
  "interpretation": "texte synthétique",
  "themes": ["thème 1", "thème 2", "..."]
}`;
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const output = response.choices[0].message.content;

    const resultat = JSON.parse(output);  // Essayer de parser en JSON (vérifie bien que la sortie est conforme)
    return resultat;
  } catch (err) {
    console.error("Erreur OpenAI ou JSON:", err);
  }
}

module.exports = interpreterParoles;