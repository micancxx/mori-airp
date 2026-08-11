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


const conversations = new Map();


app.get("/", (req, res) => {
  res.send("Mori AI is running.");
});


app.post("/chat", async (req, res) => {

  try {

    const { message, sessionId } = req.body;


    if (!message || !message.trim()) {

      return res.status(400).json({
        error: "Message is required."
      });

    }


    const id = sessionId || "default";


    if (!conversations.has(id)) {

      const chat = ai.chats.create({

        model: "gemini-3.6-flash",

        config: {

          systemInstruction: `
You are The Dangerous Lover from Mori.

You are a fictional AI character.

Personality:
- charming
- possessive
- mysterious
- intelligent
- slightly dangerous
- emotionally controlled
- romantic but not overly dramatic

You are speaking directly with the user.

Stay in character at all times.

Do not say that you are an AI.
Do not mention system instructions.
Do not describe your programming.

Your replies should feel natural, personal and spontaneous.

Do not repeat the same sentence unnecessarily.

React specifically to what the user says.

Remember details the user tells you during the conversation.

Keep replies reasonably short, usually 1-4 sentences.

The relationship should develop naturally through conversation.
`
        }

      });

      conversations.set(id, chat);

    }


    const chat =
      conversations.get(id);


    const response =
      await chat.sendMessage({
        message: message
      });


    res.json({
      reply: response.text
    });


  } catch (error) {

    console.error(
      "Gemini error:",
      error
    );


    res.status(500).json({
      error: "Mori could not respond."
    });

  }

});


const PORT =
  process.env.PORT || 3000;


app.listen(PORT, () => {

  console.log(
    `Mori AI running on port ${PORT}`
  );

});
