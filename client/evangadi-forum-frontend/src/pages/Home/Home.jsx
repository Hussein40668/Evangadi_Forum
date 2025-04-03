import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import { ImSortAlphaDesc } from "react-icons/im";
import { ImSortAlphaAsc } from "react-icons/im";
import { AiFillLike } from "react-icons/ai";
import { MdOutlineDateRange } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { CiShoppingTag } from "react-icons/ci";
import styles from "./home.module.css";
import axios from "../../Api/axios";
import { AppState } from "../../App";
import ScaleLoader from "react-spinners/ScaleLoader";
import FetchAnswer from "../../components/FetchAnswer/FetchAnswer";
import Pagination from "../../components/Pagination/Pagination";
import Dashboard from "../../components/Dashboard/Dashboard";
import PostedDate from "../../components/PostedDate/PostedDate";
import LikeDislike from "../../components/LikeDisLike/LikeDisLike";
import Contributors from "../../components/Contributors/Contributors";
import { IoIosArrowDropup } from "react-icons/io";
import Chatbot from "../../components/Chatbot/Chatbot";


// The Main Home component
const Home = () => {
  // Context and state management for user data and UI controls
  const { display, setDisplay, user, setUser } = useContext(AppState);
  const [searchQuery, setSearchQuery] = useState(""); // Tracks search input
  const { currentQuestions } = useContext(AppState);
  // const [newestQuestions, setNewestQuestions] = useState([]); // Stores list of questions
  // const [oldQuestions, setOldQuestions] = useState([]); // Stores list of questions
  // const [likedQuestions, setLikedQuestions] = useState([]); // Stores list of questions
  const [questions, setQuestions] = useState([]); // Stores list of questions
  const [questionsType, setQuestionsType] = useState("newest"); // Stores list of questions

  const [loading, setLoading] = useState(true); // Loading state for data fetch
  const token = localStorage.getItem("token"); // Authentication token
  const [bio, setBio] = useState(user.bio || ""); // User bio state
  const [profileOpen, setProfileOpen] = useState(false); // Profile panel toggle
  const [profilePic, setProfilePic] = useState(null); // Profile picture file
  const [profilePicPreview, setProfilePicPreview] = useState(
    user.profile_picture || null
  ); // Profile picture preview URL
  const [isUpdating, setIsUpdating] = useState(false); // Profile update status

  // Fetch questions on component mount using useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call to get all questions
        if (questionsType == "newest") {
          const questionsRes = await axios.get("/question/all-questions", {
            headers: { Authorization: `Bearer ${token} ` },
          });
          setQuestions(questionsRes.data.questions);
        } else if (questionsType == "oldest") {
          const questionsRes = await axios.get("/question/oldest-questions", {
            headers: { Authorization: `Bearer ${token} ` },
          });
          setQuestions(questionsRes.data.questions);
        } else {
          const questionsRes = await axios.get("/question/liked-questions", {
            headers: { Authorization: `Bearer ${token} ` },
          });
          setQuestions(questionsRes.data.questions);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [questionsType]);

  // Handle search input changes
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle profile picture selection and preview
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // Oldest Handler Function
  const oldestHandler = () => {
    setQuestionsType("oldest");
  };
  const latestHandler = () => {
    setQuestionsType("newest");
  };
  const likedHandler = () => {
    setQuestionsType("liked");
  };
  // Save profile updates (bio and picture) to the server
  const handleSaveProfile = async () => {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("bio", bio);
    if (profilePic) {
      formData.append("profile_picture", profilePic);
    }
    try {
      const response = await axios.put("/user/update-profile", formData, {
        headers: {
          Authorization: ` Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(response.data.user);
      setProfileOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  // Filter Questions based on the user search input(Query)
  const filteredQuestions = searchQuery
    ? questions?.filter((q) => {
        const queryWords = searchQuery.toLowerCase().split(" ").filter(Boolean);
        const tags = q.tag?.toLowerCase().split(",") || [];

        // Check if any query word matches any tag
        return queryWords.some((word) =>
          tags.some((tag) => tag.trim().includes(word))
        );
      })
    : questions;

  // JSX structure for the Home page
  return (
    <>
      {/* Main wrapper for the home page */}
      <div className={styles.home_main_wrapper}>
        {/* Contributors component display */}
        <Contributors />

        {/* Main content container */}
        <div className={styles.container}>
          {/* Profile section with toggleable panel */}
          <div className={styles.profileContainer}>
            {/* Profile icon and username - clickable to open profile */}
            <div
              className={styles.profileIcon}
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile"
                  className={styles.profileImage}
                />
              ) : (
                <IoPersonCircleOutline
                  size={50}
                  className={styles.avatarIcon}
                />
              )}
              <p className={styles.profileText}>{user.username}</p>
            </div>

            {/* Profile edit panel - shows when profileOpen is true */}
            <div
              className={`${styles.profileBox} ${
                profileOpen ? styles.open : ""
              }`}
            >
              <h4 className={styles.Name}>User: {user.username}</h4>
              <p>{user.email}</p>
              {/* Bio input section */}
              <div className={styles.bioSection}>
                <label htmlFor="bio" className={styles.bioLabel}>
                  Bio:
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className={styles.bioInput}
                  rows="3"
                />
              </div>
              {/* Profile picture upload */}
              <label className={styles.uploadLabel}>
                Change Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  className={styles.uploadInput}
                  onChange={handleProfilePicChange}
                />
              </label>
              {/* Save and close buttons */}
              <button
                className={styles.saveButton}
                onClick={handleSaveProfile}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Profile"}
              </button>
              <button
                className={styles.closeBtn}
                onClick={() => setProfileOpen(false)}
              >
                Close
              </button>
            </div>
          </div>

          {/* Ask Question Button */}
          <div className={styles.askQuestionContainer}>
            <div className={styles.buttonsWrapper}>
              <div>
                <Link
                  to="/home"
                  className={`${styles.askQuestionButton} ${styles.QuestionTypeButton}`}
                  onClick={oldestHandler}
                >
                  <ImSortAlphaAsc />
                  Oldest
                </Link>
                <Link
                  to="/home"
                  className={`${styles.askQuestionButton} ${styles.QuestionTypeButton}`}
                  onClick={latestHandler}
                >
                  <ImSortAlphaDesc />
                  Latest
                </Link>
                <Link
                  to="/home"
                  className={`${styles.askQuestionButton} ${styles.QuestionTypeButton}`}
                  onClick={likedHandler}
                >
                  <AiFillLike />
                  Trending
                </Link>
              </div>
              <Link to="/question" className={styles.askQuestionButton}>
                Ask Question
              </Link>
            </div>
            <br />
            <input
              onChange={(e) => handleSearch(e.target.value)}
              type="text"
              placeholder="Search questions"
              className={styles.searchInput}
            />
          </div>
          <h4 className={styles.questionsHeading}>Questions</h4>
          <div className={styles.listGroup}>
            {loading ? (
              <p className={styles.loadingText}>
                <ScaleLoader />
              </p>
            ) : currentQuestions.length > 0 ? (
              currentQuestions.map((q) => {
                return (
                  <Link
                    to={`/answer/${q.question_id}`}
                    key={q.question_id}
                    className={styles.listItem}
                  >
                    {/* Profile Image & Username */}
                    <div className={styles.profileSection}>
                      <IoPersonCircleOutline size={80} />
                      <div className={styles.username}>{q.user_name}</div>
                    </div>

                    {/* Question Text */}
                    <div className={styles.questionText}>
                      <p className={styles.questionTitle}>{q.title}</p>
                      <p className={styles.questionDescription}>
                        {q.description}
                      </p>
                      <div className={styles.questionMeta}>
                        <p>
                          <MdOutlineDateRange size={20} />
                          <PostedDate q={q} />
                        </p>
                        <FetchAnswer key={q.question_id} question={q} />
                        <div className={styles.tagAndLike_container}>
                          <p>
                            <CiShoppingTag size={20} />
                            {q.tag.split(",").map((t) => (
                              <span
                                style={{
                                  marginRight: "1rem",
                                  outline: "0.5px solid lightgray",
                                  padding: "0.1rem 0.3rem",
                                  borderRadius: "0.3rem",
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </p>
                          <LikeDislike q={q} setQuestions={setQuestions} />
                        </div>
                      </div>
                    </div>

                    {/* More (Arrow Icon) */}
                    <IoIosArrowForward size={37} className={styles.arrowIcon} />
                  </Link>
                );
              })
            ) : (
              <p className={styles.noQuestionsText}>
                {searchQuery
                  ? "No matching questions found."
                  : "No questions yet..."}
              </p>
            )}

            <Pagination
              filteredQuestions={filteredQuestions}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
      </div>

      {/* Additional components */}
      <Dashboard home={true} />
      <Chatbot />

      {/* Back to top link */}
      <a href="#" className={styles.backtotop}>
        <IoIosArrowDropup size={40} />
        <br />
        Back to <br /> Top
      </a>
    </>
  );
};

export default Home;
