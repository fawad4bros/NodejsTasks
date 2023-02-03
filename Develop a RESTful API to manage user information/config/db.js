const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = async () => {
  mongoose
    .connect(process.env.MONGODB_STRING)
    .then(() => console.log("Connected successfully"))
    .catch((err) => console.log(err));
};
module.exports = connectDB;
