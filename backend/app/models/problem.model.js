const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const problemSchema = new Schema(
  {
    firstGroup: { type: [String], required: true },
    secondGroup: { type: [String], required: true },
    correctAnswer: {
      type: String,
      required: true,
      enum: ["Left", "Right"],
    },
  },
  {
    versionKey: false,
  }
);
module.exports = mongoose.model("problems", problemSchema);
