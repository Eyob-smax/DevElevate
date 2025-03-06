import express from "express";
import { TodoCollection, TodoBoxCollection } from "../database.js";

const todo = express.Router();
todo.get("/box", async (req, res) => {
  try {
    const todoBox = await TodoBoxCollection.find();
    todoBox.sort((a, b) => {
      if (a.date === b.date) {
        return b.createTime - a.createTime;
      }
      return a.date.localeCompare(b.date);
    });

    todoBox.forEach(async (element) => {
      const title = element.title;
      const date = element.date;

      await TodoCollection.collection.countDocuments(
        { parent: `${title}-${date}` },
        (err, count) => {
          element.number = count;
          element.save();
        }
      );
    });
    res.status(200).json({ success: true, todoBox });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todo.post("/box", async (req, res) => {
  try {
    const { title, date } = req.body;
    if (!title || !date) {
      res
        .status(400)
        .json({ success: false, message: "Title and date are required" });
      return;
    }
    const todoBox = new TodoBoxCollection({
      title,
      date,
      number: 0,
    });
    await todoBox.save();
    const todoBoxData = await TodoBoxCollection.findOne({ title, date });
    res.json({
      success: true,
      message: "Todo box created successfully✅",
      todoBoxData,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todo.delete("/box", async (req, res) => {
  try {
    const { title, date } = req.body;
    if (!title || !date) {
      res
        .status(400)
        .json({ success: false, message: "Title and date are required" });
      return;
    }
    await TodoBoxCollection.deleteOne({ title, date });
    await TodoCollection.deleteMany({ parent: `${title}-${date}` });
    res.json({
      success: true,
      message: "Todo box deleted successfully✅",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todo.get("/", async (req, res) => {
  try {
    const { parentTitle, parentDate } = req.query;
    console.log(req.query);
    const parent = `${parentTitle}-${parentDate}`;

    const todo = await TodoCollection.find({ parent }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, todo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todo.post("/", async (req, res) => {
  try {
    const { parentTitle, parentDate, date, todo, priority } = req.body;
    if (!parentTitle || !parentDate || !todo) {
      res.status(400).json({ success: false, message: "incomplate Data" });
      return;
    }

    const parent = `${parentTitle}-${parentDate}`;
    const newTodo = new TodoCollection({
      parent: parent,
      date,
      todo,
      priority,
    });
    await newTodo.save();
    const todoData = await TodoCollection.findOne({
      parent,
      date,
      todo,
      priority,
    }).sort({ createdAt: -1 });
    res.json({
      success: true,
      message: "Todo created successfully✅",
      todoData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Something went wrong check your Internet",
    });
  }
});

todo.delete("/", async (req, res) => {
  try {
    const { todo, date } = req.body;
    console.log(req.body);
    await TodoCollection.deleteOne({ todo, date });
    const result = res.json({
      success: true,
      message: "Todo deleted successfully✅",
    });
    console.log(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todo.put("/", async (req, res) => {
  try {
    const {
      todo,
      date,
      priority,
      newTodo,
      newPriority,
      parentTitle,
      parentDate,
    } = req.body;
    if (newPriority === "" || newTodo === "") {
      res.json({ success: false, message: "You can't save this info" });
      return;
    }
    if (!todo || !newTodo || !newPriority || !parentTitle || !parentDate) {
      res.json({ success: false, message: "incomplate Data" });
      return;
    }

    if (todo === newTodo && newPriority === priority) {
      res.json({ success: false, message: "No changes made" });
      return;
    }

    const parent = `${parentTitle}-${parentDate}`;
    await TodoCollection.updateOne(
      { todo, date, parent },
      { $set: { todo: newTodo, priority: newPriority } }
    );
    res
      .status(200)
      .json({ success: true, message: "Todo updated successfully✅" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
export default todo;
