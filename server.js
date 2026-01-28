const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt, transparent } = req.body;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "512x512",
        background: transparent ? "transparent" : "white"
      })
    });

    const data = await response.json();

    if (!data.data || !data.data[0].b64_json) {
      return res.status(500).json({ error: "No image returned" });
    }

    res.json({
      image: `data:image/png;base64,${data.data[0].b64_json}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "generation failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
