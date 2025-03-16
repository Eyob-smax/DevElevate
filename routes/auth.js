import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import axios from "axios";

const auth = express.Router();

auth.use(cors({ origin: "*" }));
auth.use(bodyParser.json());
auth.use(express.json());
auth.use(express.urlencoded({ extended: true }));
dotenv.config();

auth.use(express.static("public/auth_files", { acceptRanges: true }));

const store = MongoStore.create({
  mongoUrl:
    "mongodb+srv://eyobsmax:%40Ihaveadream19@cluster0.gfzdy.mongodb.net/DevElevate",
});

(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://eyobsmax:%40Ihaveadream19@cluster0.gfzdy.mongodb.net/DevElevate",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
})();

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
});

const User = mongoose.model("Users", userSchema);

const verifyEmailHunter = async (email) => {
  const apiKey = process.env.HUNTER_API_KEY; // Store API key in .env file
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

auth.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  if (username === "" || email === "" || password === "") {
    return res.status(400).json({ message: "Please fill in all" });
  }

  const emailVerification = await verifyEmailHunter(email);
  console.log(emailVerification);

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

auth.post("/login", sessionMiddleware, async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (checkPassword && user) {
    req.session.user = user._id;
    if (!req.session.user) {
      return res.status(403).json({ message: "Invalid session" });
    }

    return res.status(200).json({
      session: req.session.user,
      message: "User logged in successfully",
    });
  }

  res.status(403).json({ message: "Invalid password" });
});

auth.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json({ message: "User logged out successfully" });
  });
});

export default auth;
