import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "../../Api/axios";
import styles from "./answer.module.css";
import { useRef } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaCircleArrowRight } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import Dashboard from "../../components/Dashboard/Dashboard";
import Pagination from "../../components/Pagination/Pagination";
import { AppState } from "../../App";
import PostedDate from "../../components/PostedDate/PostedDate";
const getAnswer = () => {
  const { question_id } = useParams();
  const token = localStorage.getItem("token");
  const [answer, setAnswer] = useState([]);
  const [question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, currentAnswers } = useContext(AppState);
  const [error, setError] = useState(null);
  const description = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    const descriptionValue = description.current.value;

    if (!descriptionValue) {
      alert("Please provide all required fields");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `/answers/post-answers/${question_id}`,
        {
          answer: descriptionValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Answer posted successfully");
      description.current.value = "";
      await axios
        .get(`/answers/${question_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAnswer(response.data.Answers);
        });
    } catch (error) {
      console.error("❌ Error posting answer:", error.message);
      alert(`❌ Failed to post answer: ${error.message}`);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(`/question/${question_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setQuestion(response.data.question);
          });
        await axios
          .get(`/answers/${question_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setAnswer(response.data.Answers);
          });
      } catch (err) {
        console.log(err);
        setError(
          err.response?.data?.message ||
            "No Answer Found for the asked Question! Be the First to Answer"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [question_id, token]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.questionSection}>
          <h1 className={styles.questionHeading}>QUESTION</h1>
          <h3 className={styles.questionTitle}>
            <FaCircleArrowRight size={17} color={"#0b5ed7"} /> {question.title}
          </h3>
          <div className={styles.line}></div>
          <h4 className={styles.questionDescription}>{question.content}</h4>
        </div>
        {answer.length > 0 ? (
          <div className={styles.answerSection}>
            <h2 className={styles.answerCommunity}>
              Answer From The Community
            </h2>
            {currentAnswers?.map((singleAnswer) => (
              <div key={singleAnswer.answer_id} className={styles.singleAnswer}>
                <div className={styles.avatar}>
                  <IoPersonCircleOutline size={55} />
                  <p>{singleAnswer.user_name}</p>
                </div>
                <div className={styles.answerWrapper}>
                  <div className={styles.answerContentMeta}>
                    <p className={styles.answerContent}>
                      {singleAnswer.content}
                    </p>
                  </div>
                  <div className={styles.answerMeta}>
                    <p>
                      <MdOutlineDateRange size={20} />
                      <PostedDate q={singleAnswer} />
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <Pagination filteredQuestions={answer} />
          </div>
        ) : (
          <div>
            <p className={styles.answerNotFound}>
              No Answers Yet! Be the First to Answer !!!
            </p>
          </div>
        )}
        <div>
          <form onSubmit={handleSubmit}>
            <textarea
              rows={7}
              placeholder="Your Answer . . ."
              ref={description}
              required
            ></textarea>
            <button type="submit" className={styles.submitButton}>
              Post Answer
            </button>
          </form>
        </div>
      </div>
      <Dashboard />
      <a href="#" className={styles.backtotop}>
        Back to Top
      </a>
    </>
  );
};
export default getAnswer;
