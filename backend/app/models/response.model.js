const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = new Schema(
  {
    uuid: { type: String, required: true },
    responseTo: { type: String, enum: ["Survey", "Test"] },
    answers: {
      type: [
        {
          answerTo: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          answer: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  {
    versionKey: false,
  }
);
module.exports = mongoose.model("responses", responseSchema);
