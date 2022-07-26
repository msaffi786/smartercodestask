module.exports = (sequelize, Sequelize) => {
  const ProjectSkill = sequelize.define("projectskill", {
    projectId: {
      type: Sequelize.INTEGER,
    },
    skillId: {
      type: Sequelize.INTEGER,
    },
  });
  return ProjectSkill;
};
