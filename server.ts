import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;

async function startServer() {
  const app = express();

  // Allow parsing large bases or JSON documents
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Lazy initialize GoogleGenAI safely
  let ai: GoogleGenAI | null = null;
  function getAI() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not defined on the server side.");
      }
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 1. Analyze Resume Endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { fileData, mimeType, systemInstruction } = req.body;
      if (!fileData) {
        return res.status(400).json({ error: "No file data provided." });
      }

      const client = getAI();
      const model = "gemini-3.5-flash";

      const response = await client.models.generateContent({
        model,
        contents: [
          {
            parts: [
              { text: "Please analyze this resume for ATS optimization and professional impact." },
              {
                inlineData: {
                  mimeType: mimeType || "application/pdf",
                  data: fileData,
                },
              },
            ],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        return res.status(500).json({ error: "Empty response from Gemini engine." });
      }

      const parsedJSON = JSON.parse(response.text);
      res.json(parsedJSON);
    } catch (err: any) {
      console.error("[Server Error] Analyze failed:", err);
      res.status(500).json({ error: err.message || "Engine analysis failure" });
    }
  });

  // 2. Chat Widget Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { contents, systemInstruction } = req.body;
      if (!contents || !Array.isArray(contents)) {
        return res.status(400).json({ error: "Missing contents array." });
      }

      const client = getAI();
      const model = "gemini-3.5-flash";

      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemInstruction || "You are a career assistant.",
        },
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("[Server Error] Chat failed:", err);
      res.status(500).json({ error: err.message || "Chat failure" });
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
