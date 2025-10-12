import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ObjectId } from "mongodb";
import { MAIN_URL } from "../server.js";
import { User, ChatHistory } from "../database.js";

dotenv.config();

const home = express();
home.use(cors());
home.use(express.json());

home.use((req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect(`${MAIN_URL}/login`);
  }
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const getModel = () => genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function generateQuestionPrompt(topic, difficulty) {
  return `
I want you to generate 5 questions about ${topic} for self-taught students studying web development. Each question should be relevant and tailored to deepen understanding.

### Formatting:
1. Number each question: **<Question Number>. <Question Text>**
2. List answers: a) Option A, b) Option B, c) Option C, d) Option D
3. Correct answer: **Correct Answer: <Answer Letter>**
4. No extra explanations.
5. Use ${difficulty} difficulty level.
6. Randomize content to avoid repetitive questions.
`;
}

function generateContentPrompt(topic) {
  return `
Explain the concept of ${topic} clearly and concisely, focusing on purpose, usage, examples, and practical use cases.
Keep language simple and specific to web/mobile/tech development. Do not answer non-technical topics.
`;
}

function extractGeneratedData(results) {
  const text =
    results?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const questions = [...text.matchAll(/^\*\*(\d+)\.\s(.+?)\*\*/gm)].map(
    (m) => m[2]
  );
  const answers = [...text.matchAll(/^[a-d]\)\s.+$/gm)].map((m) => m[0]);
  const correctAnswers = [
    ...text.matchAll(/^\*\*Correct Answer:\s([a-d]\))\*\*$/gm),
  ].map((m) => m[1]);

  const chunkSize = 4;
  const groupedAnswers = [];
  for (let i = 0; i < questions.length; i++) {
    groupedAnswers.push(answers.slice(i * chunkSize, (i + 1) * chunkSize));
  }

  return { questions, answers: groupedAnswers, correctAnswers };
}

let lastPrompt;
home.post("/generate", async (req, res) => {
  try {
    const { prompt: topic, difficultyLevel } = req.body;
    if (!topic)
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });

    lastPrompt = generateQuestionPrompt(topic, difficultyLevel);
    const model = getModel();
    const results = await model.generateContent(lastPrompt);
    const generatedData = extractGeneratedData(results);

    res.status(200).json({ success: true, generatedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

home.get("/generate", async (req, res) => {
  try {
    if (!lastPrompt)
      return res
        .status(400)
        .json({ success: false, message: "No prompt available" });

    const model = getModel();
    const results = await model.generateContent(lastPrompt);
    const generatedData = extractGeneratedData(results);

    res.status(200).json({
      success: true,
      generatedData,
      message: "Data fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

let lastAssistancePrompt;
home.post("/assistance", async (req, res) => {
  try {
    const { prompt: topic } = req.body;
    if (!topic)
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });

    lastAssistancePrompt = generateContentPrompt(topic);
    const model = getModel();
    const result = await model.generateContent(lastAssistancePrompt);

    res
      .status(200)
      .json({ success: true, result, message: "Data fetched successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

home.get("/assistance", async (req, res) => {
  try {
    if (!lastAssistancePrompt)
      return res
        .status(400)
        .json({ success: false, message: "No prompt available" });

    const model = getModel();
    const result = await model.generateContent(lastAssistancePrompt);

    res
      .status(200)
      .json({ success: true, result, message: "Data fetched successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

home.get("/getUser", async (req, res) => {
  try {
    const userId = req.session.passport.user;
    const userData = await User.collection.findOne({
      _id: new ObjectId(userId),
    });
    res.status(200).json({ success: true, userData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

home.post("/chat-history", async (req, res) => {
  try {
    const { userId, chat, response } = req.body;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User Unauthorized" });
    if (!chat || !response)
      return res
        .status(400)
        .json({ success: false, message: "Incomplete data" });

    const newChat = new ChatHistory({ userId, chat, response });
    await newChat.save();

    res
      .status(200)
      .json({ success: true, message: "Chat history saved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

home.get("/chat-history", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User Unauthorized" });

    const chatHistory = await ChatHistory.find({ userId }).sort({
      createTime: 1,
    });
    res.status(200).json({ success: true, chatHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

home.use(express.static("public", { acceptRanges: true }));

export default home;
