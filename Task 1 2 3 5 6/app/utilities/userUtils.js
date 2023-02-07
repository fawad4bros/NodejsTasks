const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
class userUtility {
  constructor() {}
  genHash = async (password) => {
    return bcrypt.hashSync(password, 8);
  };
  compareHash = async (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
  };
  checkEmail = async (email) => {
    const user = await User.findOne({ email: email });
    return user ? true : false;
  };
  checkRecord = async (data) => {
    const record = await User.findOne(data);
    return record === null ? false : true;
  };
  genJwtToken = (id) => {
    return jwt.sign({ subject: id }, process.env.JWT_SECRET, {expiresIn: "1h"});
  };
}

module.exports = new userUtility();
