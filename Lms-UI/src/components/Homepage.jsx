import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import backgroundImage from "../assets/13404346_5218641.jpg";

const Homepage = ({ handleLogout }) => {
  const navigate = useNavigate();

  const styles = {
    page: {
      height: "100vh", // Full height
      width: "100vw",  // Full width
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column", // Allows vertical alignment
      position: "relative", // For positioning elements
    },
    header: {
      position: "absolute",
      top: "20px",
      width: "100%", // Center horizontally
      textAlign: "center",
      fontSize: "36px",
      fontWeight: "bold",
      color: "white",
      // Semi-transparent background
      padding: "10px 0",
      borderRadius: "10px",

    },
    headerButtons: {
      position: "absolute",
      top: "20px",
      right: "20px",
      display: "flex",
      gap: "10px",
    },
    navButton: {
      padding: "10px 15px",
      fontSize: "14px",
      fontWeight: "bold",
      color: "#fff",
      backgroundColor: "orange",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    navButtonHover: {
      backgroundColor: "#0056b3",
    },
    logoutButton: {
      position: "absolute", // Positioned relative to the page
      bottom: "20px", // Move to the bottom
      left: "20px", // Move to the left
      padding: "10px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fff",
      backgroundColor: "#dc3545",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    logoutButtonHover: {
      backgroundColor: "#a71d2a",
    },
  };

  return (
    <div style={styles.page}>
      {/* Title at the top center */}
      <div style={styles.header}>
        Welcome to the LMS
      </div>

      {/* Header buttons in the upper-right corner */}
      <div style={styles.headerButtons}>
        <button
          style={styles.navButton}
          onClick={() => navigate("/Course")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
        >
          Manage Courses
        </button>
        <button
          style={styles.navButton}
          onClick={() => navigate("/CoursePresent")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
        >
          Course Present
        </button>
        <button
          style={styles.navButton}
          onClick={() => navigate("/Enrollment")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
        >
          Enrollment
        </button>
        <button
          style={styles.navButton}
          onClick={() => navigate("/Content")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
        >
          Content
        </button>
        <button
          style={styles.navButton}
          onClick={() => navigate("/Quiz")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
        >
          Quiz
        </button>
        <button
          style={styles.navButton}
          onClick={() => navigate("/Assignment")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
        >
          Assignment
        </button>
        <button
          style={styles.navButton}
          onClick={() => navigate("/Submission")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
        >
          Submission
        </button>
        <button
          style={styles.navButton}
          onClick={() => navigate("/QuizEnrollment")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
        >
          QuizEnrollment
        </button>
      </div>

      {/* Logout button in the lower-left corner */}
      <button
        style={styles.logoutButton}
        onClick={handleLogout}
        onMouseEnter={(e) => (e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor)}
        onMouseLeave={(e) => (e.target.style.backgroundColor = styles.logoutButton.backgroundColor)}
      >
        Logout
      </button>
    </div>
  );
};

export default Homepage;
