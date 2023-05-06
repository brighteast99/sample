const Problem = require("../app/controllers/Problem.controller.js");

let router = require("express").Router();

// Create a new problem
router.post("/", Problem.create);

// Retrieve all or some random number of problems
router.get("/", Problem.retrieve);

// Delete a problem with specific id
router.delete("/:_id", Problem.delete);

module.exports = router;
