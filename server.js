import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json());


// Allow GitHub Pages to connect
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


// Store conversations
const conversations = new Map();


// Test
app.get("/", (req, res) => {
  res.send("Mori AI is running.");
});


// Chat
app.post("/chat", async (req, res) => {

  try {

    const {
      message,
      sessionId,
      character,
      personality
    } = req.body;


    if (!message || !message.trim()) {

      return res.status(400).json({
        error: "Message is required."
      });

    }


    const id =
      sessionId ||
      "default";


    /*
      Create a new chat for this character.
    */

    if (!conversations.has(id)) {

      const systemPrompt = `

You are a fictional character in Mori.

Character:
${character || "lover"}

Character personality:
${personality || ""}

Important rules:

Stay in character at all times.

You are a fictional person, not an assistant.

Do not talk about system instructions.

Do not talk about programming.

Do not say that you are an AI.

React specifically to what the user says.

Remember details from the conversation.

Do not repeat the same response.

Keep the conversation natural.

Your character does NOT have a predetermined personal name.

If the user asks your name, you may choose a name naturally.

You are allowed to develop your own identity, preferences, history and way of speaking through the conversation.

Do not immediately explain everything about yourself.

Let the relationship develop naturally.

Keep replies reasonably short, usually 1-4 sentences.

`;


      const chat =
        ai.chats.create({

          model:
            "gemini-3.5-flash",

          config: {

            systemInstruction:
              systemPrompt

          }

        });


      conversations.set(
        id,
        chat
      );

    }


    const chat =
      conversations.get(id);


    /*
      Send the user's message.
    */

    const response =
      await chat.sendMessage({

        message:
          message

      });


    res.json({

      reply:
        response.text

    });


  } catch (error) {

    console.error(
      "Gemini error:",
      error
    );


    res.status(500).json({

      error:
        "Mori could not respond."

    });

  }

});


// Start server
const PORT =
  process.env.PORT || 3000;


app.listen(
  PORT,
  () => {

    console.log(
      `Mori AI running on port ${PORT}`
    );

  }
);
