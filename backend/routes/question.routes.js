const Question = require("../app/controllers/Question.controller.js");

let router = require("express").Router();

// Create a new question
router.post("/", Question.create);

// Retrieve all or a single question with specific uuid
router.get("/", Question.retrieve);

// Delete a question  with specific id
router.delete("/:_id", Question.delete);

module.exports = router;
