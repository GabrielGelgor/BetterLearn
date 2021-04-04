// DB Schema for a comment

const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  commentIndex: { type: Number, default: 0 }, //Index position in the comment array. Allows for faster deletion/reordering on post

  comment: { type: String, required: true },

  commenter: { type: String, required: true },

  score: { type: Number, default: 0 },

  date: { type: Date, default: Date.now() },
});

mongoose.model("comments", commentSchema);
