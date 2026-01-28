const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt, transparent } = req.body;

    // 1️⃣ Génération image OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
        background: transparent ? "transparent" : "white"
      })
    });

    const openaiData = await openaiRes.json();

    if (!openaiData.data || !openaiData.data[0].b64_json) {
      console.error("OPENAI ERROR:", openaiData);
      return res.status(500).json({ error: "OpenAI image failed" });
    }

    const base64Image = openaiData.data[0].b64_json;

    // 2️⃣ Upload ImageBB
    const formData = new URLSearchParams();
    formData.append("key", process.env.IMGBB_API_KEY);
    formData.append("image", base64Image);
    formData.append("name", prompt.replace(/\s+/g, "_").toLowerCase());

    const imgbbRes = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData
    });

    const imgbbData = await imgbbRes.json();

    if (!imgbbData.success) {
      console.error("IMGBB ERROR:", imgbbData);
      return res.status(500).json({ error: "ImageBB upload failed" });
    }

    // 3️⃣ Retour lien PNG
    res.json({
      image: imgbbData.data.url,
      direct: imgbbData.data.url
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Generation failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
