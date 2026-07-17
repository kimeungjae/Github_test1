import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini for AI-based anomaly explanation
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "PIAVS-Backend" });
  });

  // API: Parse Log (Simulated high-speed parsing)
  app.post("/api/parse-log", upload.single("file"), (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // In a real scenario, we'd use Dask/Pandas equivalents or high-speed stream parsers here.
    // For this prototype, we'll return a sample of the data to demonstrate the UI.
    const filename = req.file.originalname;
    console.log(`Parsing log: ${filename}`);

    res.json({
      message: "File parsed successfully",
      metadata: {
        filename,
        size: req.file.size,
        points: 5000,
        frequency: "10kHz"
      }
    });
  });

  // API: AI Anomaly Analysis
  app.post("/api/analyze-anomaly", async (req, res) => {
    const { dataContext } = req.body;
    
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({ analysis: "AI Analysis skipped: No API Key provided. Rule-base detection active." });
      }

      const prompt = `As a Power Conversion Expert at Hanwha Aerospace, analyze this signal data context and suggest possible root causes for the detected anomaly (e.g., IGBT switching failure, EMI noise, or control loop instability). Data: ${JSON.stringify(dataContext)}`;
      
      const result = await genAI.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      res.json({ analysis: result.text });
    } catch (error) {
      res.status(500).json({ error: "AI Analysis failed" });
    }
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
    console.log(`PIAVS Server running on http://localhost:${PORT}`);
  });
}

startServer();
