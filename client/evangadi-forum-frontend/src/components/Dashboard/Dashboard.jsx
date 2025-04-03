import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import axios from "../../Api/axios";
import { FaQuestionCircle } from "react-icons/fa";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { ImUsers } from "react-icons/im";
import { GrLike } from "react-icons/gr";
import { GrDislike } from "react-icons/gr";
const Dashboard = ({ home }) => {
  const [stats, setStats] = useState({
    questions: 0,
    answers: 0,
    users: 0,
    likes: 0,
    dislike: 0,
  });
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all questions
        const questionsRes = await axios.get("/question/all-questions", {
          headers: { Authorization: `Bearer ${token} ` },
        });
        const allQuestions = questionsRes.data.questions;

        // Calculate total likes
        const totalLikes = allQuestions.reduce(
          (sum, q) => sum + (q.likes || 0),
          0
        );
        const totaldisLikes = allQuestions.reduce(
          (sum, q) => sum + (q.dislike || 0),
          0
        );
        // Fetch answers
        const answersRes = await axios.get("/answers", {
          headers: { Authorization: `Bearer ${token} ` },
        });
        const allAnswers = answersRes.data.TotalAnswers[0].total_answers;
        // Fetch users
        const usersRes = await axios.get("/users", {
          headers: { Authorization: `Bearer ${token} ` },
        });
        const allUsers = usersRes.data.TotalUsers[0].total_users;

        setStats({
          questions: allQuestions.length,
          answers: allAnswers,
          users: allUsers,
          likes: totalLikes,
          dislike: totaldisLikes,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [stats]);

  return (
    <div className={home ? styles.dashboard_home : styles.dashboard}>
      <div className={styles.stat_header}>
        <h3>Statistics</h3>
        <div className={styles.line}></div>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat_card}>
          <FaQuestionCircle size={30} />
          <div>
            <h3>Questions</h3>
            <p>{stats.questions}</p>
          </div>
        </div>
        <div className={styles.stat_card}>
          <RiQuestionAnswerLine size={30} />
          <h3>Answers</h3>
          <p>{stats.answers}</p>
        </div>
        <div className={styles.stat_card}>
          <ImUsers size={30} />
          <h3>Active Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className={styles.stat_card}>
          <GrLike size={30} />
          <h3>Total Likes</h3>
          <p>{stats.likes}</p>
        </div>
        <div className={styles.stat_card}>
          <GrDislike size={30} />
          <h3>Total disLikes</h3>
          <p>{stats.dislike}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
