import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import note from "./routes/notes.js";
import todo from "./routes/to_do.js";
import auth from "./routes/auth.js";
import dotenv from "dotenv";
import mongodb from "mongodb";
// import OpenAI from "openai";
import axios from "axios";
import { Cookie } from "express-session";
import { ObjectId } from "mongodb";
import home from "./routes/home.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/notes", note);
app.use("/to-do", todo);
app.use("/", auth);
app.use("/home", home);
let isAuthenticate;

const User = async () => {
  try {
    const client = await mongodb.MongoClient.connect(
      "mongodb+srv://eyobsmax:%40Ihaveadream19@cluster0.gfzdy.mongodb.net/DevElevate"
    );
    console.log("Connected to MongoDB");
    const db = client.db("DevElevate");
    const users = db.collection("users");
    const sessions = db.collection("sessions");
    return { users, sessions };
  } catch (error) {
    console.log(error);
  }
};

let prompt;
let assistancePrompt;
const PORT = process.env.PORT || 9000;

function generateQuestionPrompt(prompt, difficulty) {
  const question = `
  I want you to generate 5 questions about ${prompt} for self-thought students studying web development. Each question should be relevant, and tailored to deepen understanding of the subject. 
  
  ### Formatting Criteria:
  1. **Each question should be numbered and follow this strict format:**
     **<Question Number>. <Question Text>**
     For example: 
     **1. What does the DOM stand for in web development?**
  
  2. **Answers should be listed in this precise format:**
     a) <Option A>
     b) <Option B>
     c) <Option C>
     d) <Option D>
  
  3. **Correct answers should follow this specific format:**
     **Correct Answer: <Answer Letter>**
     For example: 
     **Correct Answer: a)**
  
  4. **Do not include explanations or extra text, only the questions, answers, and correct answers in this strict order.**
  
  5. **Repeat this exact pattern for each question to ensure consistency.**
  
  ### Example Output:
  **1. What does the DOM stand for in web development?**
  a) Document Orientation Model  
  b) Document Object Model  
  c) Data Object Module  
  d) Data Orientation Model  
  
  **Correct Answer: b)**
  
  Ensure your output follows the above structure exactly to allow my program to process it effectively. Use the ${difficulty}(difficulty) level to make the questions suitable for students. Never deviate from this format.
  and the another thing is the ${prompt}(topic) random or non-sense you should generate random question aboout web dev`;
  return question;
}

app.post("/generate", async (req, res) => {
  try {
    prompt = generateQuestionPrompt(req.body.prompt, req.body.difficultyLevel);

    if (!prompt) {
      res.status(400).json({ success: false, message: "Prompt is required" });
      return;
    }
    const genAI = new GoogleGenerativeAI(
      "AIzaSyB4LqRlKRHTHUFTcp63qL3WTOtca-ZT71A"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const results = await model.generateContent(prompt);
    const generatedData = extractGeneratedData(results);
    res.status(200).json({ success: true, generatedData });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Prompt is required",
      message: err.message,
    });
  }
});

function extractGeneratedData(results) {
  const fetchedQuestion =
    results?.response?.candidates[0]?.content?.parts[0]?.text;
  const options = [...fetchedQuestion.matchAll(/^[a-d]\)\s.+$/gm)].map(
    (match) => match[0]
  );

  const chunkSize = 4;
  const chunkCount = 10;
  const separateArrays = [];

  for (let i = 0; i < chunkCount; i++) {
    separateArrays.push(options.slice(i * chunkSize, (i + 1) * chunkSize));
  }

  return {
    questions: [...fetchedQuestion.matchAll(/^\*\*\d+\.\s(.+?)\*\*/gm)].map(
      (match) => match[1]
    ),
    answers: [...separateArrays].slice(0, 5),
    correctAnswers: [
      ...fetchedQuestion.matchAll(/^\*\*Correct Answer:\s([a-d]\))\*\*$/gm),
    ].map((match) => match[1]),
  };
}

app.get("/generate", async (req, res) => {
  try {
    if (!prompt) {
      res.status(400).json({ success: false, message: "Prompt is required" });
      return;
    }
    const genAI = new GoogleGenerativeAI(
      "AIzaSyB4LqRlKRHTHUFTcp63qL3WTOtca-ZT71A"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const results = await model.generateContent(prompt);
    const generatedData = extractGeneratedData(results);
    res.status(200).json({
      success: true,
      generatedData,
      message: "data fetched successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Something went wrong, try again!",
      message: err.message,
    });
  }
});

function generateContent(prompt) {
  const question = `Explain the concept of ${prompt} clearly and concisely, focusing on its purpose, usage, and relevant examples. Throughout the explanation, include technical details and insights to help deepen the understanding of the concept. Provide a practical use case or example to clarify the explanation. Use simple language and avoid excessive technical jargon to ensure the explanation is easy to understand, while still offering valuable technical insight. The response should be specific to web development, mobile development, or other technology-related domains. Keep it brief and to the point. You should also be flexible and able to adapt to the user's needs, providing clear and concise information. If the user asks about topics outside of technology, even indirectly, respond with: "I am specifically designed to assist with technology-related topics only and cannot provide information outside of this scope."`;
  return question;
}

app.post("/assistance", async (req, res) => {
  try {
    assistancePrompt = generateContent(req.body.prompt);
    if (!assistancePrompt) {
      res.status(400).json({ success: false, message: "Prompt is required" });
      return;
    }
    const genAI = new GoogleGenerativeAI(
      "AIzaSyB4LqRlKRHTHUFTcp63qL3WTOtca-ZT71A"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(assistancePrompt);
    res
      .status(200)
      .json({ success: true, result, message: "data fetched successfully" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "something went wrong, try Again!",
      message: err.message,
    });
  }
});

app.get("/assistance", async (req, res) => {
  try {
    if (!assistancePrompt) {
      res.status(400).json({ success: false, message: "Prompt is required" });
      return;
    }
    const genAI = new GoogleGenerativeAI(
      "AIzaSyB4LqRlKRHTHUFTcp63qL3WTOtca-ZT71A"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(assistancePrompt);
    res
      .status(200)
      .json({ success: true, result, message: "data fetched successfully" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "something went wrong, try Again!",
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
