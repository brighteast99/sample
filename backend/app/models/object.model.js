const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const objectSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    imageURL: { type: String },
  },
  {
    versionKey: false,
  }
);
module.exports = mongoose.model("objects", objectSchema);
