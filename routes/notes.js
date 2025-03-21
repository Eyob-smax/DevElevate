import express from "express";
import debug from "debug";

const logger = debug("app:notes");

import { NotebookCollection, NoteBookBox } from "../database.js";
import { MongoClient, ObjectId } from "mongodb";

const note = express.Router();
note.use(express.json());

note.post("/", async (req, res) => {
  const { parentTitle, parentDate, title, note, topic } = req.body;
  const userId = req.query.userId;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "User Unautherized!" });
  }
  const parent = `${parentTitle}-${parentDate}`;
  try {
    const noteBook = new NotebookCollection({
      createTime: Date.now(),
      userId,
      parent,
      title,
      topic,
      note,
    });

    noteBook
      .save()
      .then(() => {
        res.json({
          success: true,
          message: "succesfully send notes to database✅",
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          message: "can't save notes to the DB",
          error: err.message,
        });
      });
  } catch (err) {
    res.json({
      success: false,
      message: "server Error while saving the notes",
      error: err.message,
    });
  }
});

note.delete("/", async (req, res) => {
  const { title, userId, note, topic } = req.body;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "User Unautherized!" });
  }
  if (!title || !note || !topic)
    return res.json({ success: false, message: "Incomplete data!" });

  try {
    await NotebookCollection.deleteOne({ title, userId, note, topic });
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    res.json({
      success: false,
      message: "there is something wrong with the DB!",
    });
  }
});

const notesFromDB = async () => {
  const notes = await NotebookCollection.collection
    .find()
    .sort({
      createTime: 1,
    })
    .toArray();
  return notes;
};

note.get("/", async (req, res) => {
  const { parentTitle, userId, parentDate } = req.query;
  if (!userId) {
    return res.json({ success: false, message: "User Unautherized!" });
  }
  try {
    const notes = await NotebookCollection.collection
      .find({ parent: `${parentTitle}-${parentDate}`, userId })
      .sort({
        createTime: 1,
      })
      .toArray();
    res.json(notes);
  } catch (err) {
    res.json({ success: false, message: "server Error", error: err.message });
  }
});

note.put("/", async (req, res) => {
  console.log(req.body);

  try {
    const {
      parentTitle,
      parentDate,
      title,
      note,
      topic,

      newTitle,
      newTopic,
      newNote,
    } = req.body;
    const userId = req.query.userId;
    if (!userId) {
      return res.json({ success: false, message: "User Unautherized!" });
    }

    if (
      !newTitle ||
      !newTopic ||
      !newNote ||
      !title ||
      !topic ||
      !note ||
      !parentTitle ||
      !parentDate
    ) {
      return res.json({ success: false, message: "Incomplete data!" });
    }

    if (newTitle === title && newTopic === topic && newNote === note) {
      return res.json({ success: false, message: "No changes made!" });
    }
    const parent = `${parentTitle}-${parentDate}`;
    const noteData = await NotebookCollection.findOne({
      parent,
      userId,
      title,
      note,
      topic,
    });

    noteData.title = newTitle;
    noteData.topic = newTopic;
    noteData.note = newNote;
    await noteData.save();
    res.json({ success: true, message: "Note Updated Successfully" });
  } catch (err) {
    res.json({ success: false, message: "server Error", error: err.message });
  }
});

note.post("/box", async (req, res) => {
  const { title, date } = req.body;
  const userId = req.query.userId;
  try {
    const newBox = new NoteBookBox({
      title,
      userId,
      date,
      number: 0,
    });
    await newBox.save();
    const boxData = await NoteBookBox.findOne({ title, userId, date });
    res.status(200).json({ success: true, boxData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

note.get("/box", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res
        .status(403)
        .json({ success: false, message: "User Unautherized!" });
    }
    let number = 0;
    const boxData = await NoteBookBox.find({ userId });
    boxData.forEach(async (box) => {
      const title = box.title;
      const date = box.date;

      const count = await NotebookCollection.collection.countDocuments({
        parent: `${title}-${date}`,
        userId,
      });
      box.number = count;
      await box.save();
    });
    res.json({ success: true, data: boxData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

note.delete("/box", async (req, res) => {
  const { title, userId, date } = req.body;
  console.log(req.body);
  if (!userId) {
    return res.json({ success: false, message: "User Unautherized!" });
  }

  if (!title || !date)
    return res.json({ success: false, message: "Incomplete data!" });
  try {
    await NoteBookBox.deleteOne({ title, userId, date });
    await NotebookCollection.deleteMany({ parent: `${title}-${date}` });
    res
      .status(200)
      .json({ success: true, message: "Box deleted successfully " + title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default note;
