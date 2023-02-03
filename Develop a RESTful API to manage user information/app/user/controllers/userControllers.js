const { User } = require("../models/user");
const utility = require("../../../utils/userUtils");
class UserController {
  constructor() {}
  getUser = async (req, res) => {
    try {
      if (await utility.checkRecord({ _id: req.params.id })) {
        const user = await User.findOne({ _id: req.params.id });
        return res.status(200).json({ user: user });
      }
      return res.status(200).json({
        message: "No user found",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  userRegistration = async (req, res) => {
    try {
      if (utility.checkPassword(req.body.password)) {
        return res.status(200).json({ message: "Password too short" });
      }
      if (await utility.checkRecord({ email: req.body.email })) {
        return res.status(200).json({ message: `User already exists` });
      }
      const hashed = await utility.genHash(req.body.password);
      if (hashed) {
        await User.create({
          email: req.body.email,
          username: req.body.username,
          password: hashed,
        });
        return res.status(201).json({ message: "Successfully Created" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  userLogin = async (req, res) => {
    try {
      if (await utility.checkRecord({ email: req.body.email })) {
        const user = await User.findOne({ email: req.body.email });
        const result = await utility.compareHash(
          req.body.password,
          user.password
        );
        if (result) {
          return res.status(200).json({ message: "Successfully Login" });
        }
      }
      return res.status(200).json({ message: "Unauthorized credentials" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  updateUser = async (req, res) => {
    try {
      if (await utility.checkRecord({ _id: req.params.id })) {
        if (utility.checkPassword(req.body.password)) {
          return res.status(200).json({ message: "Password too short" });
        }
        //What if user sets another user email while updating his record?
        const hashed = await utility.genHash(req.body.password);
        const filter = { _id: req.params.id };
        const update = {
          username: req.body.username,
          email: req.body.email,
          password: hashed,
        };
        const opts = { runValidators: true }
        await User.findOneAndUpdate(filter, update, opts);
        return res.status(200).json({
          message: "User Successfully Updated",
        });
      }
      return res.status(200).json({
        message: "No user found",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  deleteUser = async (req, res) => {
    try {
      if (await utility.checkRecord({ _id: req.params.id })) {
        await User.findOneAndRemove({ _id: req.params.id });
        return res.status(200).json({
          message: "User Successfully Deleted",
        });
      }
      return res.status(200).json({
        message: "No user found",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
}
module.exports = new UserController();


/*
// Glossary
To turn on update validators, set the runValidators option for update(), updateOne(), updateMany(), or findOneAndUpdate(). 
Be careful: update validators are off by default because they have several caveats.
https://mongoosejs.com/docs/validation.html#update-validators
*/