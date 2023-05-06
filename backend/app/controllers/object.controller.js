const fs = require("fs");
const db = require("../models");
const Object = db.object;
const DIR_NAME = process.env.MULTER_DIR_NAME;

/**
 * * Create new object data
 *
 * @param req.body must contain name of new object and may contain image for it.
 * @param req.file indicates the image uploaded to the server.
 */
exports.create = (req, res) => {
  // Request validation (name not null)
  if (!req.body.name)
    return res.status(400).send({ message: "Name is required" });

  // Construct object data
  const newObject = new Object(
    (() => {
      let newObject = {
        name: req.body.name,
      };
      if (req.file)
        // Register image url to object data if the request contains image file
        newObject["imageURL"] = `${req.protocol}://${req.get(
          "host"
        )}/${DIR_NAME}/${req.file.filename}`;

      return newObject;
    })()
  );

  // Insert data into the DB
  newObject
    .save()
    .then((result) => {
      res
        .json({
          objectCreated: {
            _id: result._id,
            name: result.name,
            imageURL: result.imageURL,
          },
        })
        .status(201);
    })
    .catch(async (err) => {
      // Delete image file from the server if the insertion fails
      if (req.file) fs.unlink(`${DIR_NAME}/${req.file.filename}`, () => {});

      res.status(500).send({
        message: err.message,
      });
    });
};

/**
 * * Retrieve all object data or certain one by its name
 *
 * @param req.query may contain name of the object to retrieve
 */
exports.retrieve = (req, res) => {
  // Construct retrieval condition
  const name = req.query.name;
  let condition = name ? { name: name } : {};

  // Retrieve data from the DB by condition(name)
  Object.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving objects.",
      });
    });
};

/**
 * * Delete certain object data designated by its _id
 *
 * @param req.params must contain _id of the object data to be deleted
 */
exports.delete = (req, res) => {
  // Request validation (_id not null)
  const _id = req.params._id;
  if (!_id) return res.status(400).send({ message: "_id is required" });

  // Delete data from the DB
  Object.findByIdAndDelete(_id)
    .then((data) => {
      if (!data)
        res.status(400).send({
          message: `Object(_id:${_id}) not found`,
        });
      else {
        if (data.imageURL) {
          // Delete image file from the server if it exists
          const filename = data.imageURL?.split("/")?.pop();
          fs.unlink(`${DIR_NAME}/${filename}`, () => {});
        }
        res.send({
          message: `Object(_id:${_id}) deleted successfully`,
        });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
