import React, { useContext, useState, useEffect } from "react";
import { AppState } from "../../App";
import styles from "./pagination.module.css";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
const Pagination = ({ filteredQuestions, setSearchQuery }) => {
  const { setCurrentQuestions, setCurrentAnswers } = useContext(AppState);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  // Calculate the subset of questions to display
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

  // Update current questions when slicedQuestions changes
  useEffect(() => {
    const current = filteredQuestions.slice(
      indexOfFirstQuestion,
      indexOfLastQuestion
    );
    setCurrentQuestions(current);
    setCurrentAnswers(current);
  }, [currentPage, filteredQuestions]);

  // Pagination functions
  const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredQuestions.length / questionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const totalPage = Math.ceil(filteredQuestions.length / questionsPerPage);
  return (
    <div className={totalPage <= 1 ? styles.paginationNone : styles.pagination}>
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        <span className={styles.previous}>Previous</span>
        <span className={styles.previousIcon}>
          <IoIosArrowBack size={23} />
        </span>
      </button>
      <div className={styles.paginationCount}>
        {currentPage}
        <p>of</p>
        {Math.ceil(filteredQuestions.length / questionsPerPage)}
      </div>
      <button
        onClick={goToNextPage}
        disabled={
          currentPage === Math.ceil(filteredQuestions.length / questionsPerPage)
        }
        className={styles.paginationButton}
      >
        <span className={styles.next}>Next</span>
        <span className={styles.nextIcon}>
          <IoIosArrowForward size={23} />
        </span>
      </button>
    </div>
  );
};

export default Pagination;
