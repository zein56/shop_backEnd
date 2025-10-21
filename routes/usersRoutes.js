const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// Kullanıcı rotaları
router.get("/users", usersController.getUsers);
router.post("/user", usersController.getUserById);
router.post("/addUser", usersController.addUser);
router.post("/checkEmail", usersController.checkEmail);
router.post("/LogIn", usersController.logIn);

module.exports = router; 
