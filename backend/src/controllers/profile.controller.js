const db = require("../models");
const Profile = db.profiles;
const Op = db.Sequelize.Op;
// Create and Save a new Profile
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create a Profile
  const profiles = {
    name: req.body.name,
    about: req.body.about,
    userId: req.body.currentUser.id,
  };
  // Save Profile in the database
  Profile.create(profiles)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Profile.",
      });
    });
};

// Retrieve all Profile from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  Profile.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving profiless.",
      });
    });
};
// Find a single Profile with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Profile.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Profile with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Profile with id=" + id,
      });
    });
};
// Update a Profile by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Profile.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Profile was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Profile with id=${id}. Maybe Profile was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Profile with id=" + id,
      });
    });
};
// Delete a Profile with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Profile.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Profile was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Profile with id=${id}. Maybe Profile was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Profile with id=" + id,
      });
    });
};
// Delete all profiless from the database.
exports.deleteAll = (req, res) => {
  Profile.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Profile were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all profiless.",
      });
    });
};
// Find all published Profile
exports.findAllPublished = (req, res) => {
  Profile.findAll({ where: { user_id: req.body.userId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving profiless.",
      });
    });
};
