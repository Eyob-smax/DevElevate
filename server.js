import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { Strategy as LocalStrategy } from "passport-local";
import MongoStore from "connect-mongo";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

import home from "./routes/home.js";
import login from "./routes/login.js";
import register from "./routes/register.js";
import note from "./routes/notes.js";
import todo from "./routes/to_do.js";
import { User, MAIN_DB } from "./database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;
const MAIN_URL = "https://dev-elevate-ruddy.vercel.app";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return cb(null, false);
      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? cb(null, user) : cb(null, false);
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => cb(null, user.id));
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err, null);
  }
});

const store = MongoStore.create({
  mongoUrl: MAIN_DB,
  collectionName: "sessions",
  ttl: 3 * 24 * 60 * 60,
});

const sessionMiddleware = session({
  secret: "dev elevate app",
  resave: true,
  saveUninitialized: true,
  store,
  cookie: { secure: false, httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 },
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/protected-route",
  })
);

app.use("/home", home);
app.use("/login", login);
app.use("/register", register);
app.use("/notes", note);
app.use("/to-do", todo);
app.use(express.static("./public/auth_files", { acceptRanges: true }));

const verifyEmailHunter = async (email) => {
  const apiKey = process.env.HUNTER_API_KEY || "YOUR_HUNTER_API_KEY";
  const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`;
  try {
    const response = await axios.get(url);
    const data = response.data.data;
    return data.result === "deliverable"
      ? { valid: true, message: "Email is valid and deliverable." }
      : { valid: false, message: `Email is ${data.result}.` };
  } catch {
    return { valid: false, message: "Email verification failed." };
  }
};

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ valid: false, message: "Please fill in all fields" });
  }
  if (
    !/^[a-zA-Z0-9]+$/.test(username) ||
    !email.includes("@") ||
    !email.includes(".")
  ) {
    return res
      .status(400)
      .json({ valid: false, message: "Invalid username or email" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(409).json({
      valid: false,
      message: "User credentials already exist",
      which: existingUser.username === username ? "username" : "email",
    });
  }

  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res
      .status(200)
      .json({ valid: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ valid: false, message: err.message });
  }
});

app.get("/protected-route", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ success: true, message: "You are authenticated" });
  } else {
    res
      .status(401)
      .json({ success: false, message: "You are not authenticated" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.get("/login-failure", (req, res) => {
  res
    .status(401)
    .json({ success: false, message: "Incorrect username or password" });
});

app.get("/quote", async (req, res) => {
  try {
    const { data } = await axios.get("https://zenquotes.io/api/quotes");
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on ${MAIN_URL}`));
