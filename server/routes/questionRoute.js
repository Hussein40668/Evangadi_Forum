const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleWare/authMiddleware");
const {
  allQuestions,
  postQuestion,
  singleQuestion,
  likeQuestion,
  disLikeQuestion,
  oldestQuestions,
    likedQuestions,
  
} = require("../controller/questionController");
router.get("/all-questions", authMiddleware, allQuestions);
router.get("/oldest-questions", authMiddleware, oldestQuestions);
router.get("/liked-questions", authMiddleware, likedQuestions);
router.post("/post-question", authMiddleware, postQuestion);
router.get("/:question_id", authMiddleware, singleQuestion);
router.patch("/like/:question_id", authMiddleware, likeQuestion);
router.patch("/dislike/:question_id", authMiddleware, disLikeQuestion);
module.exports = router;
