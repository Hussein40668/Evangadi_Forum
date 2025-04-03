const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleWare/authMiddleware");

const {
  register,
  login,
  checkUser,
  allUsers,
  topContributors,
} = require("../controller/userController");

// Register route
router.post("/register", register);
// Login route
router.post("/login", login);
// Check user
router.get("/check", authMiddleware, checkUser);
//all user
router.get("/", authMiddleware, allUsers);
//top contributors
router.get("/topContributors", authMiddleware, topContributors);

module.exports = router;
