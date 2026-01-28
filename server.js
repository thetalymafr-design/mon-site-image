import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { prompt, transparent } = req.body;

  // 1️⃣ Génération image (Replicate)
  const imageResponse = await fetch(
    "https://api.replicate.com/v1/predictions",
    {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "ideogram-ai/ideogram-v3-turbo",
        input: {
          prompt: `${prompt}, product icon, centered, studio lighting`
        }
      })
    }
  );

  const imageData = await imageResponse.json();
  const imageUrl = imageData.output[0];

  // 2️⃣ Suppression du fond (si coché)
  if (transparent) {
    const bgResponse = await fetch(
      "https://api.remove.bg/v1.0/removebg",
      {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.REMOVEBG_API_KEY
        },
        body: new URLSearchParams({
          image_url: imageUrl,
          size: "auto"
        })
      }
    );

    const buffer = await bgResponse.arrayBuffer();
    res.set("Content-Type", "image/png");
    return res.send(Buffer.from(buffer));
  }

  res.json({ image: imageUrl });
});

app.listen(3000, () => console.log("API ready"));
