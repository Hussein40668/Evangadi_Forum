import "./App.css";
import { useState, useEffect, createContext } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Auth from "./pages/Auth/Auth";
import LogIn from "./components/Login/Login";
import Home from "./pages/Home/Home";
import Question from "./pages/Question/Question";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import Answer from "./pages/Answer/Answer";
import axios from "./Api/axios";

export const AppState = createContext();
function App() {
  const [user, setUser] = useState({});
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentAnswers, setCurrentAnswers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [display, setDisplay] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate()
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
      navigate('/')
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
      <Routes>
        {/* landing page */}
        <Route path="/" element={<Layout />}>
          {/* Auth page */}
          <Route path="/" element={<Auth />}>
            <Route index element={<LogIn />} />
          </Route>
          {/* Home page Route */}
          <Route path="/home" element={<Home />} />
          {/* Question page Route */}
          <Route path="/question" element={<Question />} />
          {/* Answer page Route */}
          <Route path="/answer/:question_id" element={<Answer />} />
          {/* How It Works Page Route */}
          <Route path="/howItWorks" element={<HowItWorks />} />
        </Route>
      </Routes>
    </AppState.Provider>
  );
}

export default App;
