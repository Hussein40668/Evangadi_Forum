import React, { useState, useEffect, useContext } from "react";
import axios from "../../Api/axios";
import styles from "./contributors.module.css";
import { MdPeople } from "react-icons/md";
import { AppState } from "../../App";
const Contributors = () => {
  const [contributors, setContributors] = useState([]);
  const token = localStorage.getItem("token");
const {display , setDisplay} = useContext(AppState)
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const result = await axios.get(`/users/topContributors`, {
          headers: { Authorization: `Bearer ${token} ` },
        });
        setContributors(result.data.Contributors);
      } catch (error) {
        console.error("Error fetching Contributors:", error);
      }
    };
    console.log(contributors);
    console.log(contributors[0]);
    fetchContributors();
    displayContributors()
  }, []);

  function displayContributors () {
    if (display) {
        setDisplay(false)
    }else {
        setDisplay(true)
    }
  }
  return (
    <div className={`${styles.dashboard} ${display && styles.toggleIcon }`}>
      <div className={styles.stat_header}>
        <div className={styles.contributors}>
          <div className={styles.icon}>
            <MdPeople size={30} onClick={displayContributors} />
          </div>
          <h3 className={display && styles.hideContributors}>
            Top Contributers
          </h3>
        </div>
        <div
          className={`${styles.line} ${display && styles.hideContributors}`}
        ></div>
      </div>
      <div className={`${styles.stats}  ${display && styles.hideContributors}`}>
        {contributors?.map((c) => {
          return (
            <div className={styles.stat_card}>
              {/* <FaQuestionCircle size={30} /> */}
              <div className={styles.details}>
                <h3>{c.username}</h3>
                <p>{c.answer_count}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Contributors;