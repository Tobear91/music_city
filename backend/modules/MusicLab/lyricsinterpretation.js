const OpenAI = require("openai");

async function interpreterParoles(paroles, artiste) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });  const prompt = 
`
Tu es un expert en analyse de paroles de chansons.

Analyse les paroles suivantes : """${paroles}""" de l'artiste """${artiste}""".

Ta mission :
1. Fournir une interprétation synthétique du sens global du texte (utilise des extraits des paroles si nécessaire, mais reste concis).
2. Identifier **exactement un thème principal** dans la liste ci-dessous (en français, minuscules, singulier) :
["amour", "rupture", "espoir", "désir", "tristesse", "rébellion", "confiance en soi", "liberté", "nostalgie", "joie", "injustice", "amitié", "famille", "spiritualité", "voyage", "societe", "temps", "rêve", "mort"].
3. Ajouter de 0 à 4 **sous-thèmes** issus uniquement de la liste correspondant au thème principal :
{
  "amour": ["amour naissant", "amour passionnel", "amour impossible", "amour à distance", "amour interdit"],
  "rupture": ["séparation douloureuse", "trahison", "regrets", "réconciliation avortée"],
  "désir": ["séduction", "fantasme", "attirance physique", "amour charnel"],
  "tristesse": ["solitude", "perte", "mélancolie", "dépression"],
  "nostalgie": ["souvenirs d’enfance", "amours passés", "lieux du passé", "regret du bon vieux temps"],
  "joie": ["bonheur simple", "célébration", "optimisme", "légèreté", "fête"],
  "espoir": ["renaissance", "persévérance", "rêve de réussite", "rédemption"],
  "rébellion": ["contestation politique", "provocation", "révolution sociale"],
  "injustice": ["oppression", "inégalités", "guerre", "corruption"],
  "societe": ["critique sociale", "culture populaire", "vie urbaine", "technologie", "féminisme"],
  "confiance en soi": ["affirmation personnelle", "dépassement de soi", "liberté d’être soi-même", "résilience"],
  "liberté": ["indépendance", "voyage libre", "évasion", "fuite"],
  "amitié": ["soutien", "complicité", "amitié trahie", "souvenirs partagés"],
  "famille": ["parentalité", "relations fraternelles", "famille absente", "héritage et racines"],
  "spiritualité": ["foi religieuse", "quête de sens", "mysticisme", "destin"],
  "voyage": ["exploration", "découverte culturelle", "route et aventure", "mer et horizon"],
  "temps": ["passage du temps", "attente", "instant présent", "éternité"],
  "rêve": ["rêve d’avenir", "illusion", "rêve amoureux", "monde imaginaire"],
  "mort": ["perte d’un proche", "mort symbolique", "acceptation de la fin", "vie après la mort"]
}

Règles strictes :
- "themes[0]" = thème principal obligatoire (issu de la liste principale).
- "themes[1..4]" = sous-thèmes optionnels (issus uniquement de la liste liée au thème principal).
- Tous les éléments de "themes" doivent être en français, minuscules, au singulier.
- Ne pas inventer de nouveaux thèmes ou sous-thèmes.
- Sortie **strictement** en JSON valide, sans texte avant ou après.

Réponds uniquement au format suivant :
{
  "interpretation": "texte synthétique",
  "themes": ["thème principal", "sous-thème 1", "sous-thème 2", "sous-thème 3", "sous-thème 4"]
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