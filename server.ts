import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Credit Scoring API is running" });
  });

  // Mock Prediction History (In-memory for demo)
  const predictionHistory: any[] = [];

  app.post("/api/predict", (req, res) => {
    // In a real app, we'd call the ML model here.
    // For this demo, the ML logic is on the frontend for responsiveness,
    // but we'll store the history here.
    const prediction = req.body;
    prediction.id = Date.now();
    prediction.timestamp = new Date().toISOString();
    predictionHistory.push(prediction);
    res.json({ success: true, prediction });
  });

  app.get("/api/history", (req, res) => {
    res.json(predictionHistory);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
