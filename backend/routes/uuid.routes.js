const { v4: uuidv4 } = require("uuid");

let router = require("express").Router();

router.get("/", (req, res) => res.send(uuidv4()));

module.exports = router;
