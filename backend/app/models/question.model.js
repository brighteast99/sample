const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    order: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["MultipleChoice", "Descriptive", "LikertScale"],
    },
    option: [{ type: String, trim: true }],
  },
  {
    versionKey: false,
  }
);

questionSchema.path("option").required(function () {
  return this.type === "MultipleChoice";
}, "An option is required if the question type is multiple choice");

module.exports = mongoose.model("questions", questionSchema);
