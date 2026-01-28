const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI client (clé dans Render → Environment)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));

// Page principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Génération image IA
app.post("/generate", async (req, res) => {
  try {
    const { prompt, transparent } = req.body;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "512x512",
      background: transparent ? "transparent" : "white"
    });

    const base64Image = result.data[0].b64_json;

    res.json({
      image: `data:image/png;base64,${base64Image}`
    });

  } catch (err) {
    console.error("OPENAI ERROR:", err);
    res.status(500).json({ error: "generation failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
