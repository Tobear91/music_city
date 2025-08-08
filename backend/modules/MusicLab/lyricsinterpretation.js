require("dotenv").config();
const OpenAI = require("openai");

async function interpreterParoles(paroles, artiste) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
Tu es un expert en analyse de textes et paroles de chansons.
Analyse les paroles suivantes:"${paroles}" de l'artiste "${artiste}".

1. Propose une interprétation synthétique du sens global du texte, en citant les paroles si c'est necessaire.
2. Liste les grandes thématiques abordées (1 à 5 mots-clés maximum basés sur l'interpretation fournie en 1.).

Réponds STRICTEMENT en JSON : { "interpretation": "...", "themes": ["...", "..."] }
`;
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
