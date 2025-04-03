import React, { useState, useEffect, useContext } from "react";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
import axios from "../../Api/axios";
import styles from "./likeDislike.module.css";
const LikeDislike = ({ q, setQuestions }) => {
  const [likedQuestions, setLikedQuestions] = useState([]);
  const [dislikedQuestions, setDislikedQuestions] = useState([]);
  const token = localStorage.getItem("token");
  localStorage.removeItem("vote");
  // Function to handle likes
  const handleLike = async (questionId) => {
    if (likedQuestions.includes(questionId)) {
      return; // Exit if already liked
    }
    try {
      console.log(token);
      await axios.patch(
        `/question/like/${questionId}`,
        {},
        {
          headers: {
            Authorization:` Bearer ${token}`,
          },
        }
      );
      // Update the like count in the UI
      setLikedQuestions((prev) => [...prev, questionId]);
      setDislikedQuestions([]);
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.question_id === questionId
            ? question.dislike > 0
              ? {
                  ...question,
                  likes: question.likes + 1,
                  dislike: question.dislike - 1,
                }
              : {
                  ...question,
                  likes: question.likes + 1,
                  dislike: 0,
                }
            : question
        )
      );
    } catch (error) {
      console.error("Error liking question:", error);
    }
  };

  // Function to handle dislikes
  const handleDislike = async (questionId) => {
    if (dislikedQuestions.includes(questionId)) {
      return; // Exit if already liked
    }
    try {
      await axios.patch(
        `/question/dislike/${questionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDislikedQuestions((prev) => [...prev, questionId]);
      setLikedQuestions([]);
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.question_id === questionId
            ? question.likes > 0
              ? {
                  ...question,
                  dislike: question.dislike + 1,
                  likes: question.likes - 1,
                }
              : {
                  ...question,
                  dislike: question.dislike + 1,
                  likes: 0,
                }
            : question
        )
      );
    } catch (error) {
      console.error("Error disliking question:", error);
    }
  };

  return (
    <div className={styles.like_container}>
      <span
        className={likedQuestions.includes(q.question_id) ? styles.liked : ""}
        onClick={(e) => {
          e.stopPropagation(); // Prevent event from reaching parent Link
          e.preventDefault(); // Extra safety measure
          handleLike(q.question_id);
        }}
      >
        <SlLike className={styles.likedIcon} />
      </span>
      <span className={styles.likeText}>{q.likes}</span>
      <span
        className={
          dislikedQuestions.includes(q.question_id) ? styles.disliked : ""
        }
        onClick={(e) => {
          e.stopPropagation(); // Prevent event from reaching parent Link
          e.preventDefault(); // Extra safety measure
          handleDislike(q.question_id);
        }}
      >
        <SlDislike className={styles.disLikedIcon} />
      </span>
      <span>{q.dislike}</span>
    </div>
  );
};

export default LikeDislike;