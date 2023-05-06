const Response = require("../app/controllers/response.controller.js");

let router = require("express").Router();

// Create a new response
router.post("/", Response.create);

// Retrieve all or a single response with specified name
router.get("/", Response.retrieve);

// Delete a response with specific id
router.delete("/:_id", Response.delete);

module.exports = router;
