import express from "express";
import cors from "cors";

const login = express.Router();

login.use(cors({ origin: "*" }));
login.use(express.json());
login.use(express.urlencoded({ extended: true }));
login.use(express.static("../public/auth_files/login", { acceptRanges: true }));

export default login;
