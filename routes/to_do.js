import express from "express";
import { TodoCollection } from "../database.js";

const toDo = express.Router();
toDo.post("/", async (req, res) => {
  try {
    const todoDB = new TodoCollection({
      createTime: Date.now(),
      todo: req.body.todo,
      date: req.body.date,
      priority: req.body.priority,
    });
    todoDB
      .save()
      .then(() =>
        res.json({ success: true, message: "successfully save todos to db✅" })
      )
      .catch((err) =>
        res.json({
          success: false,
          message: "can't save todos to the db✅",
          error: err.message,
        })
      );
  } catch (err) {
    res.json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

toDo.post("/delete", async (req, res) => {
  try {
    await TodoCollection.collection.deleteOne({ index: req.body.id });

    res.json({ success: true, message: "Todo deleted successfully✅" });
  } catch (err) {
    res.json({ success: false, message: "Internal server error", error: err });
  }
});

const todosFromDB = async () => {
  try {
    const todos = await TodoCollection.collection.find().toArray();
    return todos;
  } catch (err) {
    console.log(err.message);
  }
};

toDo.get("/", async (req, res) => {
  try {
    const todos = await todosFromDB();
    res.json(todos);
  } catch (err) {
    res.json({ success: false, message: "Internal server error", error: err });
  }
});

export default toDo;
