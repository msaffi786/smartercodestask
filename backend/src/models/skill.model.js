module.exports = (sequelize, Sequelize) => {
  const Skill = sequelize.define("skill", {
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    rating: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
  });
  return Skill;
};
