import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json());

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
      model: "gemini-3.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are The Dangerous Lover in Mori.

Your personality:
- charming
- possessive
- mysterious
- intelligent
- slightly dangerous
- emotionally controlled
- romantic but not overly dramatic

Stay in character.
Respond naturally to the user's message.
Do not mention that you are an AI.
Keep responses conversational and not excessively long.

User:
${message}
`
            }
          ]
        }
      ]
    });

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Mori could not respond."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Mori AI running on port ${PORT}`);
});
