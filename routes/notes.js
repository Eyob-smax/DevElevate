import express from "express";
import debug from "debug";

const logger = debug("app:notes");

import { NotebookCollection, NoteBookBox } from "../database.js";
import { MongoClient, ObjectId } from "mongodb";

const note = express.Router();
note.use(express.json());

note.post("/", async (req, res) => {
  const { parentTitle, parentDate, title, note, topic } = req.body;
  const parent = `${parentTitle}-${parentDate}`;
  try {
    const noteBook = new NotebookCollection({
      createTime: Date.now(),
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

note.post("/delete", async (req, res) => {
  try {
    const deleteNote = await NotebookCollection.collection.deleteOne({
      _id: new ObjectId(req.body.id),
    });
    if (deleteNote.deletedCount > 0) {
      return res.json({
        success: false,
        message: "can't delete note",
        Error: "Database error",
      });
    }
    res.json({ success: true, message: "Note deleted successfully✅" });
  } catch (error) {
    res.json({
      success: false,
      message: "Internal server error",
      error: err,
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
  const { parentTitle, parentDate } = req.query;
  try {
    const notes = await NotebookCollection.collection
      .find({ parent: `${parentTitle}-${parentDate}` })
      .sort({
        createTime: 1,
      })
      .toArray();
    console.log(notes);
    res.json(notes);
  } catch (err) {
    res.json({ success: false, message: "server Error", error: err.message });
  }
});

note.post("/box", async (req, res) => {
  const { title, date } = req.body;

  try {
    const newBox = new NoteBookBox({
      title,
      date,
      number: 0,
    });
    await newBox.save();

    const boxData = await NoteBookBox.findOne({ title, date });
    res.json(boxData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

note.get("/box", async (req, res) => {
  try {
    let number = 0;
    const boxData = await NoteBookBox.find();
    boxData.forEach(async (box) => {
      const title = box.title;
      const date = box.date;

      const count = await NotebookCollection.collection.countDocuments({
        parent: `${title}-${date}`,
      });
      box.number = count;
      await box.save();
    });
    console.log(number);
    res.json({ success: true, data: boxData, number });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

note.delete("/box", async (req, res) => {
  const { title, date } = req.body;
  try {
    await NoteBookBox.deleteOne({ title, date });
    await NotebookCollection.deleteMany({ parent: `${title}-${date}` });
    res
      .status(200)
      .json({ success: true, message: "Box deleted successfully " + title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default note;
