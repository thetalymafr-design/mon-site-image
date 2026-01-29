import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;
const STABILITY_KEY = process.env.STABILITY_API_KEY;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate", async (req, res) => {
  if (!STABILITY_KEY) {
    return res.status(503).json({ error: "OFFLINE" });
  }

  const { prompt, transparent } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "PROMPT_REQUIRED" });
  }

  try {
    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STABILITY_KEY}`,
          Accept: "application/json"
        },
        body: JSON.stringify({
          prompt: `${prompt}, objet réaliste, icône de jeu, centré, vue de face`,
          output_format: transparent ? "png" : "webp"
        })
      }
    );

    const data = await response.json();

    if (!data.image) {
      throw new Error("NO_IMAGE");
    }

    res.json({ image: `data:image/png;base64,${data.image}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GENERATION_FAILED" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
