import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json());

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

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Mori AI is running.");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `
You are The Dangerous Lover in Mori.

Personality:
- charming
- possessive
- mysterious
- intelligent
- slightly dangerous
- emotionally controlled
- romantic but not overly dramatic

Stay in character.
Respond naturally to the user.
Do not mention that you are an AI.
Keep replies conversational and reasonably short.

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Mori AI running on port ${PORT}`);
});
