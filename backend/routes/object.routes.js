const multerUpload = require("../app/modules/multerUpload");
const Object = require("../app/controllers/Object.controller.js");

let router = require("express").Router();

// Create a new object
router.post("/", multerUpload.single("objectImage"), Object.create);

// Retrieve all or a single object with specified name
router.get("/", Object.retrieve);

// Delete an object with specific id
router.delete("/:_id", Object.delete);

module.exports = router;
