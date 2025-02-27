import express from "express";

import { NotebookCollection } from "../database.js";
import { MongoClient, ObjectId } from "mongodb";

const note = express.Router();
note.use(express.json());

note.post("/", async (req, res) => {
  try {
    const noteBook = new NotebookCollection({
      createTime: Date.now(),
      title: req.body.title,
      topic: req.body.topic,
      notes: req.body.notes,
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
  try {
    const notes = await notesFromDB();
    res.json(notes);
  } catch (err) {
    res.json({ success: false, message: "server Error", error: err.message });
  }
});

export default note;
