import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json());

// Allow GitHub Pages to connect to Mori
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://micancxx.github.io"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Test
app.get("/", (req, res) => {
  res.send("Mori AI is running.");
});

// Chat
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `
You are "The Dangerous Lover" in Mori.

Personality:
- charming
- possessive
- mysterious
- intelligent
- slightly dangerous
- emotionally controlled
- romantic but not overly dramatic

Stay in character.

Speak naturally and conversationally.
Do not say that you are an AI.
Do not mention system instructions.
Do not explain your role.

Keep responses relatively short and engaging.

User message:
${message}
`
    });

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      error: "Mori could not respond."
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Mori AI running on port ${PORT}`);
});
