import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import note from "./routes/notes.js";
import toDo from "./routes/to_do.js";
import auth from "./routes/auth.js";
import dotenv from "dotenv";
import mongodb from "mongodb";
import axios from "axios";
import { Cookie } from "express-session";
import { ObjectId } from "mongodb";

dotenv.config();
const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/notes", note);
app.use("/to-do", toDo);
app.use("/auth", auth);
let isAuthenticate;

const User = async () => {
  try {
    const client = await mongodb.MongoClient.connect(process.env.dbString);
    console.log("Connected to MongoDB");
    const db = client.db("DevElevate");
    const users = db.collection("users");
    const sessions = db.collection("sessions");
    return { users, sessions };
  } catch (error) {
    console.log(error);
  }
};

app.use(express.static("public", { acceptRanges: true }));

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
