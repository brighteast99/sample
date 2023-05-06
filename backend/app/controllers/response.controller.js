const db = require("../models");
const Response = db.response;

/**
 * * Create new Response data
 *
 * @param req.body must contain uuid, response type, answers
 */
exports.create = (req, res) => {
  // Request validation (uuid, responseTo, answers not null)
  if (!req.body.uuid)
    return res.status(400).send({ message: "uuid is required" });
  if (!req.body.responseTo)
    return res.status(400).send({ message: "Response type is required" });
  if (!req.body.answers)
    return res.status(400).send({ message: "Answers are required" });

  // Construct new response data
  const newResponse = new Response({
    uuid: req.body.uuid,
    responseTo: req.body.responseTo,
    answers: req.body.answers,
  });

  // Insert data into the DB
  newResponse
    .save(newResponse)
    .then(() => res.status(201).send())
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

/**
 * * Retrieve all, certain type of, or certain responses designated by uuid
 *
 * @param req.query may contain uuid, responseTo
 */
exports.retrieve = (req, res) => {
  // Construce retrieval condition
  let condition = {};
  if (req.query.uuid) condition.uuid = req.query.uuid;
  if (req.query.responseTo) condition.responseTo = req.query.responseTo;

  // Retrieve data from the DB by condition(uuid, responseTo)
  Response.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving responses.",
      });
    });
};

/**
 * * Delete certain response data designated by its _id
 *
 * @param  req.params must contain _id of the response data to be deleted
 */
exports.delete = (req, res) => {
  // Request validation (_id not null)
  const _id = req.params._id;
  if (!_id) return res.status(400).send({ message: "_id is required" });

  // Delete data from the DB
  Response.findByIdAndDelete(_id)
    .then((data) => {
      if (!data)
        res.status(400).send({
          message: `Response(_id:${_id}) not found`,
        });
      else {
        res.send({
          message: `Response(_id:${_id}) deleted successfully`,
        });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
