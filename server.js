const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 10000;

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middlewares
app.use(express.json());
app.use(express.static(__dirname));

// Page principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Génération image IA
app.post("/generate", async (req, res) => {
  try {
    const { prompt, transparent } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt manquant" });
    }

    const fullPrompt = `
Icône d'inventaire FiveM ultra réaliste :
${prompt},
objet centré, vue de face,
${transparent ? "fond totalement transparent" : "fond neutre sombre"},
PNG, sans texte, sans ombre, style propre et net
`;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1024", // ⚠️ taille valide uniquement
    });

    const imageBase64 = result.data[0].b64_json;

    res.json({
      image: `data:image/png;base64,${imageBase64}`,
    });
  } catch (err) {
    console.error("OPENAI ERROR:", err);
    res.status(500).json({
      error: "Le générateur est hors ligne, contactez Atsar",
    });
  }
});

// Lancement serveur
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
