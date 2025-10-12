import express from "express";
import { NotebookCollection, NoteBookBox } from "../database.js";

const note = express.Router();
note.use(express.json());

function validateUserId(userId, res) {
  if (!userId) {
    res.status(401).json({ success: false, message: "User Unauthorized!" });
    return false;
  }
  return true;
}

note.post("/", async (req, res) => {
  const { parentTitle, parentDate, title, note: content, topic } = req.body;
  const userId = req.query.userId;
  if (!validateUserId(userId, res)) return;

  const parent = `${parentTitle}-${parentDate}`;

  try {
    const newNote = new NotebookCollection({
      createTime: Date.now(),
      userId,
      parent,
      title,
      topic,
      note: content,
    });

    await newNote.save();
    res
      .status(200)
      .json({ success: true, message: "Note saved successfully ✅" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while saving the note",
      error: err.message,
    });
  }
});

note.delete("/", async (req, res) => {
  const { title, userId, note: content, topic } = req.body;
  if (!validateUserId(userId, res)) return;
  if (!title || !content || !topic) {
    return res
      .status(400)
      .json({ success: false, message: "Incomplete data!" });
  }

  try {
    await NotebookCollection.deleteOne({ title, userId, note: content, topic });
    res
      .status(200)
      .json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database error while deleting the note",
      error: err.message,
    });
  }
});

note.get("/", async (req, res) => {
  const { parentTitle, userId, parentDate } = req.query;
  if (!validateUserId(userId, res)) return;

  try {
    const parent = `${parentTitle}-${parentDate}`;
    const notes = await NotebookCollection.collection
      .find({ parent, userId })
      .sort({ createTime: 1 })
      .toArray();

    res.status(200).json({ success: true, notes });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

note.put("/", async (req, res) => {
  const {
    parentTitle,
    parentDate,
    title,
    note: oldNote,
    topic,
    newTitle,
    newTopic,
    newNote,
  } = req.body;

  const userId = req.query.userId;
  if (!validateUserId(userId, res)) return;

  if (
    !parentTitle ||
    !parentDate ||
    !title ||
    !oldNote ||
    !topic ||
    !newTitle ||
    !newTopic ||
    !newNote
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Incomplete data!" });
  }

  if (title === newTitle && topic === newTopic && oldNote === newNote) {
    return res
      .status(400)
      .json({ success: false, message: "No changes made!" });
  }

  try {
    const parent = `${parentTitle}-${parentDate}`;
    const noteData = await NotebookCollection.findOne({
      parent,
      userId,
      title,
      note: oldNote,
      topic,
    });

    if (!noteData) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found!" });
    }

    noteData.title = newTitle;
    noteData.topic = newTopic;
    noteData.note = newNote;
    await noteData.save();

    res
      .status(200)
      .json({ success: true, message: "Note updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

note.post("/box", async (req, res) => {
  const { title, date } = req.body;
  const userId = req.query.userId;
  if (!validateUserId(userId, res)) return;

  try {
    const newBox = new NoteBookBox({ title, userId, date, number: 0 });
    await newBox.save();

    const boxData = await NoteBookBox.findOne({ title, userId, date });
    res.status(200).json({ success: true, boxData });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

note.get("/box", async (req, res) => {
  const userId = req.query.userId;
  if (!validateUserId(userId, res)) return;

  try {
    const boxData = await NoteBookBox.find({ userId });

    // Update number of notes in each box
    await Promise.all(
      boxData.map(async (box) => {
        const count = await NotebookCollection.collection.countDocuments({
          parent: `${box.title}-${box.date}`,
          userId,
        });
        box.number = count;
        await box.save();
      })
    );

    res.status(200).json({ success: true, data: boxData });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

note.delete("/box", async (req, res) => {
  const { title, userId, date } = req.body;
  if (!validateUserId(userId, res)) return;
  if (!title || !date)
    return res
      .status(400)
      .json({ success: false, message: "Incomplete data!" });

  try {
    await NoteBookBox.deleteOne({ title, userId, date });
    await NotebookCollection.deleteMany({ parent: `${title}-${date}` });

    res
      .status(200)
      .json({ success: true, message: `Box '${title}' deleted successfully` });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

export default note;
