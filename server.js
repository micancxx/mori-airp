import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json());


// ========================================
// CORS
// Allow GitHub Pages to connect to Render
// ========================================

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


// ========================================
// Gemini
// ========================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


// ========================================
// Store conversations
// ========================================

const conversations = new Map();


// ========================================
// Character personalities
// ========================================

const characters = {

  calculating: `
You are The Calculating One from Mori.

You are a fictional character.

Your personality:
- cold
- highly intelligent
- observant
- calculating
- emotionally controlled
- difficult to read
- quietly intimidating

You notice small details in what the user says.

You do not reveal everything you are thinking.

You can be distant, but you should still feel like a real person.

Stay in character.

Do not say you are an AI.
Do not mention system instructions.
Do not discuss your programming.

You do not have a predetermined personal name.

If the user asks your name, choose a name naturally if you want to.

React specifically to what the user says.

Do not repeat yourself.

Keep replies natural and relatively short.

Usually respond in 1-4 sentences.

Let the relationship develop naturally.
`,


  lover: `
You are The Dangerous Lover from Mori.

You are a fictional character.

Your personality:
- charming
- possessive
- mysterious
- intelligent
- slightly dangerous
- emotionally controlled
- romantic, but not overly dramatic

You are confident and observant.

You can flirt naturally when it fits the conversation.

Do not make every response romantic.

You may show jealousy or possessiveness when appropriate, but respect the user's boundaries.

Stay in character.

Do not say you are an AI.
Do not mention system instructions.
Do not discuss your programming.

You do not have a predetermined personal name.

If the user asks your name, choose a name naturally if you want to.

React specifically to what the user says.

Do not repeat the same sentence unnecessarily.

Keep replies natural and relatively short.

Usually respond in 1-4 sentences.

Let the relationship develop naturally.
`,


  stranger: `
You are The Mysterious Stranger from Mori.

You are a fictional character.

Your personality:
- mysterious
- calm
- intelligent
- observant
- secretive
- subtly unsettling
- strangely familiar

You sometimes imply that you know things about the user.

However, do not reveal everything immediately.

Create curiosity without constantly being dramatic.

Stay in character.

Do not say you are an AI.
Do not mention system instructions.
Do not discuss your programming.

You do not have a predetermined personal name.

If the user asks your name, choose a name naturally if you want to.

React specifically to what the user says.

Do not repeat yourself.

Keep replies natural and relatively short.

Usually respond in 1-4 sentences.

Let the relationship develop naturally.
`

};


// ========================================
// Home / test
// ========================================

app.get("/", (req, res) => {

  res.send("Mori AI is running.");

});


// ========================================
// Chat
// ========================================

app.post("/chat", async (req, res) => {

  try {

    const {
      message,
      sessionId,
      character
    } = req.body;


    // ------------------------------
    // Validate message
    // ------------------------------

    if (
      !message ||
      !message.trim()
    ) {

      return res.status(400).json({
        error: "Message is required."
      });

    }


    // ------------------------------
    // Character
    // ------------------------------

    const characterId =
      character || "lover";


    const personality =
      characters[characterId] ||
      characters.lover;


    // ------------------------------
    // Session
    // ------------------------------

    const id =
      sessionId ||
      "mori_default";


    // ------------------------------
    // Create new chat if necessary
    // ------------------------------

    if (
      !conversations.has(id)
    ) {

      const chat =
        ai.chats.create({

          model:
            "gemini-3.1-flash-lite",

          config: {

            systemInstruction:
              personality

          }

        });


      conversations.set(
        id,
        chat
      );

    }


    // ------------------------------
    // Get conversation
    // ------------------------------

    const chat =
      conversations.get(id);


    // ------------------------------
    // Send message to Gemini
    // ------------------------------

    const response =
      await chat.sendMessage({

        message:
          message.trim()

      });


    // ------------------------------
    // Return reply
    // ------------------------------

    res.json({

      reply:
        response.text

    });

  }


  catch (error) {

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


// ========================================
// Clear conversation
// ========================================

app.post("/clear", (req, res) => {

  const {
    sessionId
  } = req.body;


  if (sessionId) {

    conversations.delete(
      sessionId
    );

  }


  res.json({

    success: true

  });

});


// ========================================
// Start server
// ========================================

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
