const express = require("express");
const databaseConnection = require("./app/config/db");
const { logError, returnError } = require("./app/middlewares/errorhandler");

require("dotenv").config({ path: "./.env" }); // Used for setting environment variables

const app = express();
app.use(express.json()); // Used for Raw JSON Format
// app.use(express.urlencoded({ extended: false })); // Used for x-www-form-urlencoded

require("./app/routesDefinations/userRouteDefs")(app); //IIFE

app.listen(process.env.PORT, () => {
  console.log(`Server is up on port: ${process.env.PORT}`);
  databaseConnection();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/fawad", (req, res) => {
  console.log(req.body);
  res.send("Hello Fawad");
});
// Error Handler (Should be last piece of middleware)
app.use(logError);
app.use(returnError);
