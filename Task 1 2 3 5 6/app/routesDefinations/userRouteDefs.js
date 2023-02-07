const userRoute = require("../routes/userRoute");

module.exports = function (app) {
  app.use("/api/user", userRoute);
};
