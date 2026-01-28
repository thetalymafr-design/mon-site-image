const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// pour lire le JSON
app.use(express.json());

// servir les fichiers statiques (index.html, css, js, images)
app.use(express.static(__dirname));

// page principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// génération (FAKE pour l’instant)
app.post("/generate", (req, res) => {
  res.json({
    image: "https://via.placeholder.com/256?text=Image+en+cours"
  });
});

// démarrage serveur
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
