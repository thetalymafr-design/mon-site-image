const express = require("express");
const path = require("path");

const app = express();

// Render PORT (OBLIGATOIRE)
const PORT = process.env.PORT || 10000;

// ===== CONFIG =====
// Mets false tant que ton compte OpenAI n’est PAS vérifié
const GENERATOR_ENABLED = false;

// ==================

app.use(express.json());
app.use(express.static(__dirname));

// Page principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint génération
app.post("/generate", async (req, res) => {
  if (!GENERATOR_ENABLED) {
    return res.status(503).json({
      error: "Le générateur est hors ligne, contactez Atsar",
    });
  }

  // Quand ton compte sera vérifié, la génération IA viendra ici
  // Pour l’instant on met un placeholder propre
  res.json({
    imageUrl: "/logo.png",
  });
});

// Lancement serveur (IMPORTANT POUR RENDER)
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
