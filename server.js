import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import note from "./routes/notes.js";
import toDo from "./routes/to_do.js";
import auth from "./routes/auth.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static("public"));

app.use("/notes", note);
app.use("/to-do", toDo);
app.use("/auth", auth);

let prompt;
let assistancePrompt;
const PORT = process.env.PORT || 8090;

app.post("/generate", async (req, res) => {
  prompt = req.body.questionPrompt;
  if (!prompt) {
    res.status(400).json({ message: "Prompt is required" });
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  res.json(result);
});

app.get("/generate", async (req, res) => {
  if (!prompt) {
    res.status(400).json({ message: "Prompt is required" });
    return;
  }
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  res.json(result);
});

app.post("/assistance", async (req, res) => {
  assistancePrompt = req.body.prompt;
  if (!assistancePrompt) {
    res.status(400).json({ message: "Prompt is required" });
    return;
  }
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(assistancePrompt);
  res.json(result);
});

app.get("/assistance", async (req, res) => {
  if (!assistancePrompt) {
    res.status(400).json({ message: "Prompt is required" });
    return;
  }
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(assistancePrompt);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
