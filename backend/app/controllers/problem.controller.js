const db = require("../models");
const Problem = db.problem;

/**
 * * Create new problem data
 *
 * @param req.body must contian firstGroup, secondGroup and correctAnswer
 */
exports.create = (req, res) => {
  // Request validation (firstGroup, secondGroup and correctAnswer not null)
  if (!req.body.firstGroup || !req.body.secondGroup)
    return res.status(400).send({ message: "Two groups are required" });
  if (!req.body.correctAnswer)
    return res.status(400).send({ message: "Correct answer is required" });

  // Construct problem data
  const newProblem = new Problem({
    firstGroup: req.body.firstGroup,
    secondGroup: req.body.secondGroup,
    correctAnswer: req.body.correctAnswer,
  });

  // Insert data into the DB
  newProblem
    .save(newProblem)
    .then(() => res.json({ _id: newProblem._id }).status(201).send())
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the problem.",
      });
    });
};

/**
 * * Retrieve all/some number of problem data or specific one by its _id
 *
 * @param req.query may contain count and _id
 */
exports.retrieve = (req, res) => {
  // Case that req.query does not contain count condition
  if (!req.query.count) {
    // Construct retrieval conditon
    let condition = {};
    if (req.query._id) condition._id = req.query._id;

    // Retrieve data from the DB by condition(_id)
    Problem.find(condition)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retriving problems.",
        });
      });
    // Case that req.body contains count condition
  } else {
    // Sample "count" problems from the DB
    Problem.aggregate([{ $sample: { size: parseInt(req.query.count) } }])
      .exec()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving problems.",
        });
      });
  }
};

/**
 * * Delete certain problem data designated by its _id
 *
 * @param req.params must contain _id of the problem data to be deleted
 */
exports.delete = (req, res) => {
  // Request validatin (_id not null)
  const _id = req.params._id;
  if (!_id) return res.status(400).send({ message: "_id is required" });

  // Delete data from the DB
  Problem.findByIdAndRemove(_id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Problem(_id:${_id}) not found`,
        });
      } else {
        res.send({
          message: `Problem(_id:${_id}) deleted successfully`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
