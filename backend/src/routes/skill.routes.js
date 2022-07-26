module.exports = (app) => {
  const skills = require("../controllers/skill.controller.js");
  var router = require("express").Router();
  // Create a new skill
  router.post("/", skills.create);
  // Retrieve all published skills
  router.get("/", skills.findAllPublished);
  // Retrieve a single skill with id
  router.get("/:id", skills.findOne);
  // Delete a skill with id
  router.delete("/:id", skills.delete);
  // Delete all skills
  router.delete("/", skills.deleteAll);
  app.use("/api/skills", router);
};
