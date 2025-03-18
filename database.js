import mongoose from "mongoose";
import dotenv from "dotenv";
import debug from "debug";
import AutoIncrement from "mongoose-sequence";

const logger = debug("app:db");
dotenv.config();

mongoose.connect(process.env.dbString).then(() => {
  logger("Connected to database");
});

const connec = mongoose.connection;
const AutoIncrementPlugin = AutoIncrement(connec);

const Schema = mongoose.Schema;

const noteBookSchema = new Schema({
  createTime: Number,
  userId: String,
  parent: String,
  title: String,
  topic: String,
  note: String,
});

const todoSchema = new Schema({
  createTime: { type: Number, default: Date.now() },
  userId: String,
  parent: String,
  todo: String,
  date: String,
  priority: String,
});

const todoBoxSchema = new Schema({
  createTime: Number,
  userId: String,
  title: String,
  date: String,
  number: Number,
  index: Number,
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const noteBookBoxSchema = new Schema({
  createTime: { type: Number, default: Date.now() },
  title: String,
  userId: String,
  date: String,
  number: Number,
  index: {
    type: Number,
    unique: true,
    default: 1,
  },
});

noteBookBoxSchema.plugin(AutoIncrementPlugin, { inc_field: "index" });

const User = mongoose.model("User", userSchema);
const NotebookCollection = mongoose.model("Notebook", noteBookSchema);
const TodoBoxCollection = mongoose.model("TodoBox", todoBoxSchema);
const TodoCollection = mongoose.model("Todo", todoSchema);
const NoteBookBox = mongoose.model("NotebookBox", noteBookBoxSchema);

export {
  NotebookCollection,
  TodoCollection,
  NoteBookBox,
  TodoBoxCollection,
  User,
};
