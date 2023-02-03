const express = require("express");
const router = express.Router();

const userController = require("../controllers/userControllers");

router.get("/get-user/:id", userController.getUser);
router.post("/user-registration", userController.userRegistration);
router.post("/user-login", userController.userLogin);
router.put("/update-user/:id",  userController.updateUser);
router.delete("/delete-user/:id",  userController.deleteUser);

module.exports = router;