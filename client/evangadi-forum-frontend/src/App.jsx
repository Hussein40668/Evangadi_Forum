import "./App.css";
import { useState, useEffect, createContext } from "react";
import Router from "./Router";
import axios from "./Api/axios";

export const AppState = createContext();
function App() {
  const [user, setUser] = useState({});
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentAnswers, setCurrentAnswers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
    const [display, setDisplay] = useState(false);
  const token = localStorage.getItem("token");
  const userOnStorage = localStorage.getItem("user");

  async function checkUser() {
    try {
      const { data } = await axios.get("/users/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data);

      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      localStorage.removeItem("user");
      setUser({});
    }
  }

  useEffect(() => {
    checkUser();
  }, [token, userOnStorage]);
  const values = {
    user,
    setUser,
    currentQuestions,
    setCurrentQuestions,
    currentPage,
    setCurrentPage,
    currentAnswers,
    setCurrentAnswers,
    display,
    setDisplay,
  };
  return (
    <AppState.Provider value={values}>
      <Router />
    </AppState.Provider>
  );
}

export default App;
