module.exports = (sequelize, Sequelize) => {
  const Profile = sequelize.define("profile", {
    name: {
      type: Sequelize.STRING,
    },
    about: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
  });
  return Profile;
};
