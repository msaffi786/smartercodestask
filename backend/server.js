const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./src/models");

var corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to smarter coders application." });
});
// routes
require("./src/routes/skill.routes")(app);
require("./src/routes/project.routes")(app);
require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/profile.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// { force: true } to drop and re-sync
db.sequelize
  .sync()
  .then(() => {
    console.log("sync db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
