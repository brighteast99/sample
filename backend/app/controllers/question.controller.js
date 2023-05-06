const db = require("../models");
const Question = db.question;

/**
 * * Create new question data
 *
 * @param req.body must contian order, title, question type and, by condition, option
 */
exports.create = (req, res) => {
  // Request validation (order, title, type not null)
  if (req.body.order == null)
    return res.status(400).send({ message: "Order is required" });
  if (!req.body.title)
    return res.status(400).send({ message: "Title is required" });
  if (!req.body.type)
    return res.status(400).send({ message: "Question type is required" });

  // Request validation (option not null if the type is 'MultipleChoice')
  if (req.body.type == "MultipleChoice" && !req.body.option)
    return res.status(400).send({
      message: "Option is required if the question type is 'MultipleChoice'",
    });

  // Construct question data
  const newQuestion = new Question(
    (() => {
      let newQuestion = {
        order: req.body.order,
        title: req.body.title,
        type: req.body.type,
        option: req.body.option ?? [],
      };
      if (req.body.option) newQuestion["option"] = req.body.option;

      return newQuestion;
    })()
  );

  // Insert data into the DB
  newQuestion
    .save(newQuestion)
    .then(() => res.json({ _id: newQuestion._id }).status(201).send())
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

/**
 * * Retrieve all question data or certain one by its _id
 *
 * @param req.query may contain _id
 */
exports.retrieve = (req, res) => {
  // Construct retrieval condition
  const _id = req.query._id;
  let condition = _id ? { _id: _id } : {};

  // Retrieve data fron the DB by condition(_id) and order by 'order'
  Question.find(condition)
    .sort("order")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving questions.",
      });
    });
};

/**
 * * Delete certain question data designated by its _id
 *
 * @param req.params must contain _id of the question data to be deleted
 */
exports.delete = (req, res) => {
  // Request validation (_id not null)
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "_id is required" });

  // Delete data from the DB
  Question.findByIdAndRemove(id)
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: `Question(_id:${_id}) not found`,
        });
      else
        res.send({
          message: `Question(_id:${_id}) deleted successfully`,
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
