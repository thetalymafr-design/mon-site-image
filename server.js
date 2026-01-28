const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

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
        background: "transparent"
      })
    });

    const data = await response.json();
    res.json({ image: data.data[0].url });
  } catch (err) {
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on po
