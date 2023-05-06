var express = require("express");
var path = require("path");
var router = express.Router();

// Pass routing to front-end page
router.get("*", function (req, res, next) {
  res.sendFile(path.resolve(__dirname, "../docs/index.html"));
});

module.exports = router;
