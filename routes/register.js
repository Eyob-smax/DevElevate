import express from "express";
import cors from "cors";

const register = express.Router();

register.use(cors({ origin: "*" }));
register.use(express.json());
register.use(express.urlencoded({ extended: true }));
register.use(
  express.static("../public/auth_files/register", { acceptRanges: true })
);

export default register;
