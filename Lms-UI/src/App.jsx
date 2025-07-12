import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Course from "./components/Course";
import CoursePresent from "./components/CoursePresent";
import Enrollment from "./components/Enrollment";
import Homepage from "./components/Homepage"; // Import Homepage
import Content from "./components/Content";
import Quiz from "./components/Quiz";
import Assignment from "./components/Assignment";
import Submission from "./components/Submission";
import QuizEnrollment from "./components/QuizEnrollment";

import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <Routes>
      <Route path="/" element={token ? <Homepage handleLogout={handleLogout} /> : <Login setToken={setToken} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/Course" element={token ? <Course token={token} handleLogout={handleLogout} /> : <Login setToken={setToken} />} />
      <Route path="/CoursePresent" element={token ? <CoursePresent token={token} handleLogout={handleLogout} /> : <Login setToken={setToken} />} />
      <Route path="/Enrollment" element={token ? <Enrollment token={token} handleLogout={handleLogout} /> : <Login setToken={setToken} />} />
      <Route path="/Content" element={token ? <Content token={token} handleLogout={handleLogout} /> : <Login setToken={setToken} />} />
      <Route path="/Quiz" element={token ? <Quiz token={token} handleLogout={handleLogout} /> : <Login setToken={setToken} />} />
      <Route path="/Assignment" element={token ? <Assignment token={token} handleLogout={handleLogout} /> : <Login setToken={setToken} />} />
      <Route path="/Submission" element={token ? <Submission token={token} handleLogout={handleLogout} /> : <Login setToken={setToken} />} />
      <Route path="/QuizEnrollment" element={token ? <QuizEnrollment token={token} handleLogout={handleLogout} /> : <Login setToken={setToken} />} />


    </Routes>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
