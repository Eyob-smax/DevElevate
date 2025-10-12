import express from "express";
import { TodoCollection, TodoBoxCollection } from "../database.js";

const todo = express.Router();

function validateUserId(userId, res) {
  if (!userId) {
    res.status(403).json({ success: false, message: "User unauthorized" });
    return false;
  }
  return true;
}

todo.get("/box", async (req, res) => {
  const userId = req.query.userId;
  if (!validateUserId(userId, res)) return;

  try {
    const todoBox = await TodoBoxCollection.find({ userId });
    todoBox.sort((a, b) => {
      if (a.date === b.date) return b.createTime - a.createTime;
      return a.date.localeCompare(b.date);
    });

    await Promise.all(
      todoBox.map(async (element) => {
        const count = await TodoCollection.collection.countDocuments({
          parent: `${element.title}-${element.date}`,
          userId,
        });
        element.number = count;
        await element.save();
      })
    );

    res.status(200).json({ success: true, todoBox });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todo.post("/box", async (req, res) => {
  const { title, userData, date } = req.body;
  if (!userData || !title || !date) {
    return res.status(400).json({ success: false, message: "Incomplete data" });
  }

  try {
    const todoBox = new TodoBoxCollection({
      userId: userData,
      title,
      date,
      number: 0,
    });
    await todoBox.save();
    const todoBoxData = await TodoBoxCollection.findOne({
      title,
      date,
      userId: userData,
    });
    res
      .status(200)
      .json({
        success: true,
        message: "Todo box created successfully✅",
        todoBoxData,
      });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todo.delete("/box", async (req, res) => {
  const { title, userId, date } = req.body;
  if (!validateUserId(userId, res) || !title || !date) return;

  try {
    await TodoBoxCollection.deleteOne({ title, userId, date });
    await TodoCollection.deleteMany({ parent: `${title}-${date}` });
    res
      .status(200)
      .json({ success: true, message: "Todo box deleted successfully✅" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todo.get("/", async (req, res) => {
  const { parentTitle, userId, parentDate } = req.query;
  if (!validateUserId(userId, res)) return;

  try {
    const parent = `${parentTitle}-${parentDate}`;
    const todos = await TodoCollection.find({ parent, userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, todo: todos });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todo.post("/", async (req, res) => {
  const {
    parentTitle,
    parentDate,
    userId,
    date,
    todo: task,
    priority,
  } = req.body;
  if (!validateUserId(userId, res) || !parentTitle || !parentDate || !task) {
    return res.status(400).json({ success: false, message: "Incomplete data" });
  }

  try {
    const parent = `${parentTitle}-${parentDate}`;
    const newTodo = new TodoCollection({
      parent,
      userId,
      date,
      todo: task,
      priority,
    });
    await newTodo.save();

    const todoData = await TodoCollection.findOne({
      parent,
      date,
      todo: task,
      priority,
    }).sort({ createdAt: -1 });
    res
      .status(200)
      .json({
        success: true,
        message: "Todo created successfully✅",
        todoData,
      });
  } catch (err) {
    res
      .status(400)
      .json({
        success: false,
        message: "Something went wrong",
        error: err.message,
      });
  }
});

todo.delete("/", async (req, res) => {
  const { todo: task, userId, date } = req.body;
  if (!validateUserId(userId, res)) return;

  try {
    await TodoCollection.deleteOne({ todo: task, userId, date });
    res
      .status(200)
      .json({ success: true, message: "Todo deleted successfully✅" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todo.put("/", async (req, res) => {
  const {
    todo: oldTodo,
    date,
    userId,
    priority,
    newTodo,
    newPriority,
    parentTitle,
    parentDate,
  } = req.body;
  if (
    !validateUserId(userId, res) ||
    !oldTodo ||
    !newTodo ||
    !newPriority ||
    !parentTitle ||
    !parentDate
  ) {
    return res.status(400).json({ success: false, message: "Incomplete data" });
  }
  if (oldTodo === newTodo && priority === newPriority) {
    return res.status(400).json({ success: false, message: "No changes made" });
  }

  try {
    const parent = `${parentTitle}-${parentDate}`;
    await TodoCollection.updateOne(
      { todo: oldTodo, userId, date, parent },
      { $set: { todo: newTodo, priority: newPriority } }
    );
    res
      .status(200)
      .json({ success: true, message: "Todo updated successfully✅" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todo.put("/status", async (req, res) => {
  const {
    todo: task,
    date,
    userId,
    status,
    parentTitle,
    parentDate,
  } = req.body;
  if (
    !validateUserId(userId, res) ||
    !task ||
    !status ||
    !parentTitle ||
    !parentDate
  ) {
    return res.status(400).json({ success: false, message: "Incomplete data" });
  }

  try {
    const parent = `${parentTitle}-${parentDate}`;
    await TodoCollection.updateOne(
      { todo: task, userId, date, parent },
      { $set: { status } }
    );
    res
      .status(200)
      .json({ success: true, message: "Todo status updated successfully✅" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default todo;
