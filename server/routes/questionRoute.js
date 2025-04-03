const express = require("express");
const router = express.Router();
const authHeader = require("../MiddleWare/authMiddleware");
const {
  allQuestions,
  postQuestion,
  singleQuestion,
  likeQuestion,
  disLikeQuestion,
  oldestQuestions,
    likedQuestions,
  
} = require("../controller/questionController");
router.get("/all-questions", authHeader, allQuestions);
router.get("/oldest-questions", authHeader, oldestQuestions);
router.get("/liked-questions", authHeader, likedQuestions);
router.post("/post-question", authHeader, postQuestion);
router.get("/:question_id", authHeader, singleQuestion);
router.patch("/like/:question_id", authHeader, likeQuestion);
router.patch("/dislike/:question_id", authHeader, disLikeQuestion);
module.exports = router;
