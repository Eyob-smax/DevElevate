import mongoose from "mongoose";
import dotenv from "dotenv";
import debug from "debug";
import AutoIncrement from "mongoose-sequence";

const logger = debug("app:db");
dotenv.config();

const connection = await mongoose.connect(process.env.dbString);
logger("Connected to database");

const connec = mongoose.connection;
const AutoIncrementPlugin = AutoIncrement(connec);

const Schema = mongoose.Schema;

const noteBookSchema = new Schema({
  createTime: Number,
  parent: String,
  title: String,
  topic: String,
  note: String,
});

const todoSchema = new Schema({
  createTime: Number,
  todo: String,
  date: String,
  priority: String,
});

const noteBookBoxSchema = new Schema({
  createTime: { type: Number, default: Date.now() },
  title: String,
  date: String,
  number: Number,
  index: {
    type: Number,
    unique: true,
    default: 1,
  },
});

noteBookBoxSchema.plugin(AutoIncrementPlugin, { inc_field: "index" });

const NotebookCollection = mongoose.model("Notebook", noteBookSchema);
const TodoCollection = mongoose.model("Todo", todoSchema);
const NoteBookBox = mongoose.model("NotebookBox", noteBookBoxSchema);

NotebookCollection.collection.createIndex({
  todo: "text",
  topic: "text",
  title: "text",
});

export { NotebookCollection, TodoCollection, NoteBookBox };
