const { skills } = require("../models");
const db = require("../models");
const Project = db.projects;
const Skill = db.skills;
const ProjectSkill = db.projectskill;
const Op = db.Sequelize.Op;
// Create and Save a new Project

async function create(req, res) {
  // try {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Project
  const project = {
    title: req.body.title,
    description: req.body.description,
    userId: req.body.currentUser.id,
  };

  // Save Project in the database
  let projectdata = await Project.create(project);

  console.log(projectdata);

  for (let i = 0; i < req.body.skills.length; i++) {
    console.log(req.body.skills);

    const element = req.body.skills[i];
    console.log(element);

    if (element) {
      console.log(element.skillId);

      let value = parseInt(element.skillId);

      let skilldata = await db.skills.findByPk(value);
      console.log("this is skill data ");
      console.log(skilldata);
      console.log("this is project data ");

      console.log(projectdata);
      await ProjectSkill.create({
        projectId: projectdata.id,
        skillId: value,
      });
      // dat = await projectdata.addSkills(skilldata);

      // console.log(dat);
    }
  }

  return res.status(200).send({ projectdata });
  // }
  // catch (err) {
  //   res.status(500).send({
  //     message: err || "Some error occurred while creating the Project.",
  //   });
  // }
}
module.exports.create = create;

// Retrieve all Projects from the database.
async function findAll(req, res) {
  try {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    let projectdetails = await Project.findAll({
      where: condition,
      include: [
        {
          model: ProjectSkill,
          required: false,
          as: "projectskill",
          include: [
            {
              model: skills,
              required: false,
              as: "skilldetails",
            },
          ],
        },
      ],
    });

    projectdetails = JSON.parse(JSON.stringify(projectdetails));

    for (let i = 0; i < projectdetails.length; i++) {
      const element = projectdetails[i].projectskill;
      for (let j = 0; j < element.length; j++) {
        const element2 = element[j].title ? element[j].title : "noskill";

        projectdetails.skilltitle = element2;
      }
    }

    return res.status(500).send({ projectdetails });
  } catch {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Projects.",
    });
  }
}

module.exports.findAll = findAll;
// Find a single Project with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Project.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Project with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Project with id=" + id,
      });
    });
};
// Update a Project by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Project.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Project was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Project with id=${id}. Maybe Project was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Project with id=" + id,
      });
    });
};
// Delete a Project with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Project.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Project was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Project with id=${id}. Maybe Project was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Project with id=" + id,
      });
    });
};
// Delete all Projects from the database.
exports.deleteAll = (req, res) => {
  Project.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Projects were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Projects.",
      });
    });
};
// Find all published Projects
exports.findAllPublished = (req, res) => {
  Project.findAll({
    where: { userId: req.query.userId },
    include: [
      {
        model: ProjectSkill,
        required: false,
        as: "projectskill",
        // include: [
        //   {
        //     model: Skill,
        //     required: false,
        //     as: "skills",
        //   },
        // ],
      },
    ],
  }).then((data) => {
    res.send(data);
  });
  // .catch((err) => {
  //   res.status(500).send({
  //     message:
  //       err.message || "Some error occurred while retrieving Projects.",
  //   });
  // });
};
