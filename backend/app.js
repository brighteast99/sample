require("dotenv").config({ path: `.env.local` });
var createError = require("http-errors");
var path = require("path");
var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

// Middleware setup
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "docs")));

// Routes
app.use("/api/objects", require("./routes/object.routes"));
app.use("/api/problems", require("./routes/problem.routes"));
app.use("/api/questions", require("./routes/question.routes"));
app.use("/api/responses", require("./routes/response.routes"));
app.use("/api/uuid", require("./routes/uuid.routes"));
app.use("/", require("./routes/index"));

module.exports = app;
