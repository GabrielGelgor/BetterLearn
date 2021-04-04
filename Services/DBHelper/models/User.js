// DB Schema for a User

const mongoose = require("mongoose");
const projectSchema = require("./Project");
const { Schema } = mongoose;

// NOTE: For now, id will be the GOOGLE ID provided through the OAUTH flow.
const userSchema = new Schema({
  id: { type: String, required: true, immutable: true },

  userName: { type: String, required: true },

  techs: { type: [String], default: [] },

  bio: { type: String, default: "" },

  projects: { type: [String], default: [] },
});

mongoose.model("users", userSchema);
