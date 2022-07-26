module.exports = (app) => {
  const projects = require("../controllers/project.controller.js");
  var router = require("express").Router();
  // Create a new project
  router.post("/", projects.create);
  // Retrieve all published projects
  router.get("/", projects.findAllPublished);
  // Retrieve a single project with id
  router.get("/:id", projects.findOne);
  // Delete a project with id
  router.delete("/:id", projects.delete);
  // Delete all projects
  router.delete("/", projects.deleteAll);
  app.use("/api/projects", router);
};
