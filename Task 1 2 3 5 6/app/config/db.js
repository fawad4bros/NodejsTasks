const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const databaseConnection = async () => {
  mongoose
    .connect(process.env.MONGODB_STRING)
    .then(() => console.log("Database Connected successfully"))
    .catch((err) => console.log(err));
};
module.exports = databaseConnection;