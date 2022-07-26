const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.skills = require("./skill.model.js")(sequelize, Sequelize);
db.projects = require("./project.model.js")(sequelize, Sequelize);
db.profiles = require("./profile.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.projectskill = require("./project-skill.model.js")(sequelize, Sequelize);

db.projects.hasMany(db.projectskill, {
  foreignKey: "projectId",
  sourceKey: "id",
  as: "projectskill",
});

db.projectskill.hasOne(db.skills, {
  foreignKey: "id",
  sourceKey: "skillId",
  as: "skillsdetails",
});

// db.projects.belongsToMany(db.skills, {
//   through: "project_skill",
//   as: "projects",
//   foreignKey: "projectId",
// });
// db.skills.belongsToMany(db.projects, {
//   through: "project_skill",
//   as: "skills",
//   foreignKey: "SkillId",
// });

module.exports = db;
