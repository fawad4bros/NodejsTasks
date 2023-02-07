const express = require("express");
const multer  = require('multer')

const upload = multer({ dest: 'uploads/' })
const verifyToken = require("../middlewares/jwt");
const userController = require("../controllers/userControllers");
const router = express.Router();

router.get("/get-user/:id", verifyToken, userController.getUser);
router.post("/user-registration",userController.userRegistration);
router.post("/user-login", userController.userLogin);
router.put("/update-user/:id",   verifyToken, userController.updateUser);
router.delete("/delete-user/:id",  verifyToken, userController.deleteUser);

router.get("/user-pagination", userController.pagination)
router.post("/user-image", upload.single('image'), userController.userImgUpload);

module.exports = router;

/*
// Glossary
https://www.npmjs.com/package/multer

*/