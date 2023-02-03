const userRoute = require("../routes/user.route");

module.exports = function (app) {
  app.use("/api/user", userRoute);
};