import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(__dirname));

// ===== PAGE PRINCIPALE =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== GENERATION IMAGE (OFFLINE POUR L’INSTANT) =====
app.post("/generate", async (req, res) => {
  // Tant que OpenAI n’est pas vérifié
  return res.status(503).json({
    error: "Le générateur est hors ligne, contactez Atsar"
  });
});

// ===== LANCEMENT SERVEUR =====
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
