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
import home from "./routes/home.js";
import login from "./routes/login.js";
import axios from "axios";
import register from "./routes/register.js";
import { User } from "./database.js";
import note from "./routes/notes.js";
import todo from "./routes/to_do.js";
import { MAIN_DB } from "./database.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 9000;

const MAIN_URL = `https://develevate-production.up.railway.app`;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return cb(null, false);
      }

      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? cb(null, user) : cb(null, false);
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const store = MongoStore.create({
  mongoUrl: `${MAIN_DB}`,
  collectionName: "sessions",
  ttl: 60 * 60 * 24,
});

const sessionMiddleware = session({
  secret: "dev elevate app",
  resave: true,
  saveUninitialized: true,
  store,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
});

//check is user is authenticated
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/protected-route",
  }),
  (err, req, res, next) => {
    if (err) next(err);
  }
);

app.use("/home", home);
app.use("/login", login);
app.use("/register", register);
app.use("/notes", note);
app.use("/to-do", todo);

const verifyEmailHunter = async (email) => {
  const apiKey = "162bad867fbb15565b9ff631341f35e101dbb038";
  const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data.data;

    if (data.result === "deliverable") {
      return { valid: true, message: "Email is valid and deliverable." };
    } else {
      return { valid: false, message: `Email is ${data.result}.` };
    }
  } catch (error) {
    console.error("Error verifying email:", error.message);
    return { valid: false, message: "Email verification failed." };
  }
};

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (username === "" || email === "" || password === "") {
    return res
      .status(400)
      .json({ valid: false, message: "Please fill in all" });
  }

  const emailVerification = await verifyEmailHunter(email);

  if (!emailVerification.valid) {
    return res
      .status(400)
      .json({ valid: false, message: "please enter correct email to precede" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isUserExist = await User.findOne({ username });
  const isEmailExist = await User.findOne({ email });

  if (isUserExist || isEmailExist) {
    return res.status(409).json({
      valid: false,
      message:
        "User credentials already exist! Please use unique email and username",
      which: isUserExist ? "username" : isEmailExist ? "email" : "both",
    });
  }

  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res
      .status(200)
      .json({ valid: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message });
  }
});

app.get("/protected-route", (req, res, next) => {
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
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/login-failure", (req, res, next) => {
  res
    .status(401)
    .json({ success: false, message: "Incorrect password or user name" });
  next();
});

app.get("/quote", async (req, res) => {
  try {
    const response = await axios.get("https://zenquotes.io/api/quotes");
    const data = response.data;
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.use(express.static("./public/auth_files", { acceptRanges: true }));
export { MAIN_URL };
app.listen(PORT, () => {
  console.log(`Server is running on port ${MAIN_URL}`);
});
