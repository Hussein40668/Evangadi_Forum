const express = require("express");
const router = express.Router();
const authHeader = require("../middleware/authMiddleware");
const {
  postAnswer,
  getAnswer,
  allAnswers,
} = require("../controller/answerController");

router.post("/post-answers/:question_id", authHeader, postAnswer);
router.get("/:question_id", authHeader, getAnswer);
router.get("/", authHeader, allAnswers);

module.exports = router;
