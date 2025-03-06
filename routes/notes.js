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

note.delete("/", async (req, res) => {
  const { title, note, topic } = req.body;
  if (!title || !note || !topic)
    return res.json({ success: false, message: "Incomplete data!" });

  try {
    await NotebookCollection.deleteOne({ title, note, topic });
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
  const { parentTitle, parentDate } = req.query;
  try {
    const notes = await NotebookCollection.collection
      .find({ parent: `${parentTitle}-${parentDate}` })
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
  const {
    title,
    note,
    topic,
    parentTitle,
    parentDate,
    newNote,
    newTopic,
    newTitle,
  } = req.body;
  if (!title || !note || !topic || !newNote || !newTopic || !newTitle) {
    return res.json({ success: false, message: "Incomplete data!" });
  }

  if (title === newTitle && note === newNote && topic === newTopic) {
    return res.json({ success: false, message: "No changes found!" });
  }

  try {
    const result = await NotebookCollection.updateOne(
      { title, note, topic, parent: `${parentTitle}-${parentDate}` },
      { $set: { title: newTitle, note: newNote, topic: newTopic } }
    );

    if (result.modifiedCount === 0) {
      return res.json({
        success: false,
        message: "No matching note found to update",
      });
    }
    res.json({ success: true, message: "Note updated successfully✅" });
  } catch (err) {
    res.json({
      success: false,
      message: "there is something wrong with the DB!",
    });
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
    res.json({ success: true, data: boxData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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
