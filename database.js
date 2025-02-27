import mongoose from "mongoose";
import dotenv from "dotenv";
import debug from "debug";

const logger = debug("app:db");
dotenv.config();

(async function createDb() {
  try {
    const connection = await mongoose.connect(process.env.dbString);
  } catch (err) {
    console.log("Can't connect to database");
  }
})();

const Schema = mongoose.Schema;
const noteBookSchema = new Schema({
  createTime: Number,
  title: String,
  topic: String,
  notes: String,
});

const todoSchema = new Schema({
  createTime: Number,
  todo: String,
  date: String,
  priority: String,
});

const NotebookCollection = mongoose.model("Notebook", noteBookSchema);
const TodoCollection = mongoose.model("Todo", todoSchema);

NotebookCollection.collection.createIndex({
  todo: "text",
  topic: "text",
  title: "text",
});

export { NotebookCollection, TodoCollection };
