const User = require("../models/userModel");
const utility = require("../utilities/userUtils");
const {updateReqValid, signUpReqValid, paginationValid } = require("../helpers/userValidator");
const uploadFile = require("../aws/s3");
class UserController {
  constructor() {}
  getUser = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        return res.status(200).json({ user: user });
      }
      return res.status(200).json({
        message: "No user found",
      });
    } catch (error) {
      next(error);
    }
  };

  userRegistration = async (req, res, next) => {
    try {
      const { error, value } = signUpReqValid(req.body);
      if (error) {
        return res.status(200).json({ message: error });
      }
      const { email, username, password } = value;
      if (await utility.checkRecord({ email: email })) {
        return res.status(200).json({ message: `User already exists` });
      }
      const hashed = await utility.genHash(password);
      if (hashed) {
        const user = await User.create({
          email: email,
          username: username,
          password: hashed,
        });
        if (user) {
          const token = utility.genJwtToken(user._id);
          return res.status(200).json({
            _id: user._id,
            name: user.username,
            userToken: token,
            message: "Successfully Created",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  userLogin = async (req, res, next) => {
    try {
      if (await utility.checkRecord({ email: req.body.email })) {
        const user = await User.findOne({ email: req.body.email });
        const isMatch = await utility.compareHash(
          req.body.password,
          user.password
        );
        if (isMatch) {
          const token = utility.genJwtToken(user._id);
          return res.status(200).json({
            _id: user._id,
            name: user.username,
            userToken: token,
            message: "Successfully Login",
          });
        }
      }
      return res.status(200).json({ message: "Unauthorized credentials" });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const {error, value} = updateReqValid(req.body)
      if (error) {
        return res.status(200).json({ message: error });
      }
      const {username, email, _id} = value
      if (!await utility.checkRecord({ _id: _id })) {
        return res.status(200).json({ message: "No user found" });
      }
      if (await utility.checkRecord({ email: email })) {
        return res.status(200).json({ message: `User already exists` });
      }
        const filter = { _id: _id };
        const update = {
          username: username,
          email: email,
        };
        const opts = { runValidators: true };
        await User.findOneAndUpdate(filter, update, opts);
        return res.status(200).json({
          message: "User Successfully Updated",
        });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
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
      next(error);
    }
  };

  userImgUpload = async (req, res) => {
    try {
      const file = req.file;
      return res.status(200).json({
        message: file.path,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  pagination = async (req, res) => {
    // page=4&limit=2
    const { error, value } = paginationValid(req.query);
    if (error) {
      return res.status(200).json({ message: error });
    }
    const { page = 1, limit = 10 } = value;
    try {
      const posts = await User.find()
        .limit(limit * 1) //4*1=4
        .skip((page - 1) * limit) //(4-1)*2->(3)*2=6
        .exec();
      // .skip() after a certain number of documents
      // .exec() executing dynamically created queries
      const count = await User.count(); //totalCount 7
      return res.status(200).json({
        posts,
        totalPages: Math.ceil(count / limit), // (7/2) 3.5 -> upper whole 4
        currentPage: page,
      });
    } catch (error) {
      next(error);
    }
  };
}
module.exports = new UserController();

/*
// Glossary
To turn on update validators, set the runValidators option for update(), updateOne(), updateMany(), or findOneAndUpdate(). 
Be careful: update validators are off by default because they have several caveats.
https://mongoosejs.com/docs/validation.html#update-validators

store image to s3 nodejs
https://medium.com/free-code-camp/how-to-set-up-simple-image-upload-with-node-and-aws-s3-84e609248792
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album-full.html
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-node-examples.html
https://www.youtube.com/watch?v=jwp4U6v-3h4
https://www.sammeechward.com/upload-images-to-s3-from-node-back-end
*/
