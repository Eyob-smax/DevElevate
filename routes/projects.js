import express from "express";
import multer from "multer";
import fs from "fs";

const projects = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "video/mp4",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-7z-compressed",
    "text/html",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});

projects.post(
  "/",
  upload.fields([
    { name: "source_code", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, description, date, time, concept } = req.body;
      console.log("Files received:", req.files);
      const imagePath = req.files?.image ? req.files.image[0].path : null;
      const videoPath = req.files?.video ? req.files.video[0].path : null;
      const sourceCodePath = req.files?.source_code
        ? req.files.source_code[0].path
        : null;
      if (!sourceCodePath) throw new Error("Source code file is missing");

      res.status(200).json({ message: "Project uploaded successfully!" });
    } catch (error) {
      console.error("Error handling request:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default projects;
