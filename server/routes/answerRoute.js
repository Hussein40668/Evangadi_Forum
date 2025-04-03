const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")
const {
  postAnswer,
  getAnswer,
  allAnswers,
} = require("../controller/answerController");

router.post("/post-answers/:question_id", authMiddleware, postAnswer);
router.get("/:question_id", authMiddleware, getAnswer);
router.get("/", authMiddleware, allAnswers);

module.exports = router;
