import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static("."));

app.post("/generate", async (req, res) => {
  try {
    const { prompt, transparent } = req.body;

    if (!process.env.STABILITY_API_KEY) {
      return res.status(500).json({ error: "STABILITY_API_KEY manquante" });
    }

    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: `${prompt}, realistic FiveM inventory icon, centered object, front view, ${transparent ? "transparent background" : "dark background"}, no shadow`,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30
        })
      }
    );

    const data = await response.json();

    if (!data.artifacts || !data.artifacts[0]) {
      console.error("STABILITY ERROR:", data);
      return res.status(500).json({ error: "Erreur génération Stability" });
    }

    res.json({
      image: `data:image/png;base64,${data.artifacts[0].base64}`
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
