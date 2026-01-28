const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE JSON =====
app.use(express.json());
app.use(express.static(__dirname));

// ===== LOG IP =====
app.use((req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const date = new Date().toISOString().replace("T", " ").split(".")[0];
  const log = `[${date}] IP: ${ip}\n`;

  fs.appendFile("access.log", log, (err) => {
    if (err) console.error("Log error:", err);
  });

  next();
});

// ===== PAGE PRINCIPALE =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== GENERATION (placeholder pour plus tard) =====
app.post("/generate", (req, res) => {
  res.status(500).json({ error: "Génération non active" });
});

// ===== START =====
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
