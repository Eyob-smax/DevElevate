import express from "express";

const home = express.Router();

home.use(express.static("../public", { acceptRanges: true }));

export default home;
