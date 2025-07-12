import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function QuizManagement({ token, handleLogout }) {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [coursePresents, setCoursePresents] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    coursePresentId: '',
    quizTitle: '',
    quizDescription: '',
    maxScore: '',
    dueDate: '',
  });

  const [updateQuizData, setUpdateQuizData] = useState({
    quizId: '',
    coursePresentId: '',
    quizTitle: '',
    quizDescription: '',
    maxScore: '',
    dueDate: '',
  });

  const [deleteQuizId, setDeleteQuizId] = useState('');

  // Fetch permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7174/api/Permissions/2`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const permissionNames = response.data.map((perm) => perm.permissionName);
        setPermissions(permissionNames);
      } catch (err) {
        console.error('Error fetching permissions:', err);
      }
    };

    fetchPermissions();
  }, [token]);

  // Fetch a specific quiz by quizId
  const fetchQuizById = async (quizId) => {
    try {
      console.log(quizzes)
      const response = await axios.get(`https://localhost:7174/api/Quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      setQuizzes([response.data]); // Set the single quiz in the quizzes array
    } catch (err) {
      console.error('Error fetching quiz:', err);
    }
  };


  const fetchCoursePresents = async () => {
    try {
      const response = await axios.get('https://localhost:7174/api/coursepresent/view', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      setCoursePresents(response.data); // Response should include courseName and currentEnrollments
    } catch (err) {
      console.error('Error fetching course presents:', err);
    }
  };


  // Add a new quiz
  const addQuiz = async (e) => {
    e.preventDefault();
    try {
      if (permissions.includes('Quiz.Create')) {
        await axios.post('https://localhost:7174/api/Quiz/create', newQuiz, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Quiz created successfully!');
        setNewQuiz({
          coursePresentId: '',
          quizTitle: '',
          quizDescription: '',
          maxScore: '',
          dueDate: '',
        });
        fetchQuizById();
      } else {
        alert('You do not have permission to create a quiz.');
      }
    } catch (err) {
      console.error('Error creating quiz:', err);
    }
  };

  // Update an existing quiz
  const updateQuiz = async (e) => {
    e.preventDefault();
    try {
      if (permissions.includes('Quiz.Update')) {
        await axios.put(
          `https://localhost:7174/api/Quiz/update/${updateQuizData.quizId}`,
          updateQuizData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Quiz updated successfully!');
        setUpdateQuizData({
          quizId: '',
          coursePresentId: '',
          quizTitle: '',
          quizDescription: '',
          maxScore: '',
          dueDate: '',
        });
        fetchQuizById();
      } else {
        alert('You do not have permission to update a quiz.');
      }
    } catch (err) {
      console.error('Error updating quiz:', err);
    }
  };

  // Delete a quiz
  const deleteQuiz = async (e) => {
    e.preventDefault();
    try {
      if (permissions.includes('Quiz.Delete')) {
        await axios.delete(
          `https://localhost:7174/api/Quiz/delete/${deleteQuizId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Quiz deleted successfully!');
        setDeleteQuizId('');
        fetchQuizById();
      } else {
        alert('You do not have permission to delete a quiz.');
      }
    } catch (err) {
      console.error('Error deleting quiz:', err);
    }
  };

  useEffect(() => {
    fetchQuizById();
    fetchCoursePresents();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Quiz Management</h1>

      {/* Fetch Quiz by ID */}
      <div style={styles.form}>
        <h2 style={styles.subHeader}>Fetch Quiz by ID</h2>
        <input
          type="number"
          style={styles.input}
          placeholder="Enter Quiz ID"
          onChange={(e) => setDeleteQuizId(e.target.value)} // Reuse deleteQuizId state for simplicity
        />
        <button
          style={styles.button}
          onClick={() => fetchQuizById(deleteQuizId)}
          disabled={!deleteQuizId}
        >
          Fetch Quiz
        </button>
      </div>

      {/* Quiz List */}
      {quizzes.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Row</th>
              <th style={styles.tableHeader}>Quiz Title</th>
              <th style={styles.tableHeader}>Quiz Description</th>
              <th style={styles.tableHeader}>Max Score</th>
              <th style={styles.tableHeader}>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={quiz.quizId}>
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>{quiz.quizTitle}</td>
                <td style={styles.tableCell}>{quiz.quizDescription}</td>
                <td style={styles.tableCell}>{quiz.maxScore}</td>
                <td style={styles.tableCell}>{quiz.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No quizzes available.</p>
      )}

      {/* Add Quiz */}
      {permissions.includes('Quiz.Create') && (
        <form onSubmit={addQuiz} style={styles.form}>
          <h2 style={styles.subHeader}>Create Quiz</h2>

          {/* Course Present ID */}
          <select
            style={styles.input}
            value={newQuiz.coursePresentId}
            onChange={(e) =>
              setNewQuiz({ ...newQuiz, coursePresentId: e.target.value })
            }
          >
            <option value="">Select Course</option>
            {coursePresents.map((course) => (
              <option key={course.coursePresentId} value={course.coursePresentId}>
                {course.course?.courseName} {/* Assuming courseName is the name of the course */}
              </option>
            ))}
          </select>

          {/* Quiz Title */}
          <input
            style={styles.input}
            type="text"
            placeholder="Quiz Title"
            value={newQuiz.quizTitle}
            onChange={(e) =>
              setNewQuiz({ ...newQuiz, quizTitle: e.target.value })
            }
            required
          />

          {/* Quiz Description */}
          <textarea
            style={styles.input}
            placeholder="Quiz Description"
            value={newQuiz.quizDescription}
            onChange={(e) =>
              setNewQuiz({ ...newQuiz, quizDescription: e.target.value })
            }
            required
          />

          {/* Max Score */}
          <input
            style={styles.input}
            type="number"
            placeholder="Max Score"
            value={newQuiz.maxScore}
            onChange={(e) =>
              setNewQuiz({ ...newQuiz, maxScore: e.target.value })
            }
            required
          />

          {/* Due Date */}
          <input
            style={styles.input}
            type="date"
            placeholder="Due Date"
            value={newQuiz.dueDate}
            onChange={(e) =>
              setNewQuiz({ ...newQuiz, dueDate: e.target.value })
            }
            required
          />

          {/* Submit Button */}
          <button type="submit" style={styles.button}>
            Create Quiz
          </button>
        </form>
      )}

      {/* Update Quiz */}
      {permissions.includes('Quiz.Update') && (
        <form onSubmit={updateQuiz} style={styles.form}>
          <h2 style={styles.subHeader}>Update Quiz</h2>

          {/* Dropdown to select a quiz */}
          <select
            style={styles.input}
            value={updateQuizData.quizId}
            onChange={(e) => {
              const selectedQuizId = e.target.value;
              const selectedQuiz = quizzes.find(
                (quiz) => quiz.quizId === parseInt(selectedQuizId)
              );
              setUpdateQuizData(
                selectedQuiz
                  ? {
                    quizId: selectedQuiz.quizId,
                    quizTitle: selectedQuiz.quizTitle,
                    quizDescription: selectedQuiz.quizDescription,
                    maxScore: selectedQuiz.maxScore,
                    dueDate: selectedQuiz.dueDate,
                  }
                  : { ...updateQuizData, quizId: selectedQuizId }
              );
            }}
          >
            <option value="">Select Quiz to Update</option>
            {quizzes.map((quiz) => (
              <option key={quiz.quizId} value={quiz.quizId}>
                {quiz.quizTitle}
              </option>
            ))}
          </select>

          {/* Quiz Title */}
          <input
            style={styles.input}
            type="text"
            placeholder="Quiz Title"
            value={updateQuizData.quizTitle}
            onChange={(e) =>
              setUpdateQuizData({ ...updateQuizData, quizTitle: e.target.value })
            }
            required
          />

          {/* Quiz Description */}
          <textarea
            style={styles.input}
            placeholder="Quiz Description"
            value={updateQuizData.quizDescription}
            onChange={(e) =>
              setUpdateQuizData({
                ...updateQuizData,
                quizDescription: e.target.value,
              })
            }
            required
          />

          {/* Max Score */}
          <input
            style={styles.input}
            type="number"
            placeholder="Max Score"
            value={updateQuizData.maxScore}
            onChange={(e) =>
              setUpdateQuizData({ ...updateQuizData, maxScore: e.target.value })
            }
            required
          />

          {/* Due Date */}
          <input
            style={styles.input}
            type="date"
            placeholder="Due Date"
            value={updateQuizData.dueDate}
            onChange={(e) =>
              setUpdateQuizData({ ...updateQuizData, dueDate: e.target.value })
            }
            required
          />

          {/* Submit Button */}
          <button type="submit" style={styles.button}>
            Update Quiz
          </button>
        </form>
      )}

      {/* Delete Quiz */}
      {permissions.includes('Quiz.Delete') && (
        <form onSubmit={deleteQuiz} style={styles.form}>
          <h2 style={styles.subHeader}>Delete Quiz</h2>

          {/* Dropdown to select a quiz */}
          <select
            style={styles.input}
            value={deleteQuizId}
            onChange={(e) => setDeleteQuizId(e.target.value)}
          >
            <option value="">Select Quiz to Delete</option>
            {quizzes.map((quiz) => (
              <option key={quiz.quizId} value={quiz.quizId}>
                {quiz.quizTitle}
              </option>
            ))}
          </select>

          {/* Delete Button */}
          <button
            type="submit"
            style={{ ...styles.button, backgroundColor: '#dc3545' }}
          >
            Delete Quiz
          </button>
        </form>
      )}
      <button
        onClick={() => navigate('/')}
        style={{ ...styles.button, backgroundColor: 'orange' }}
      >
        Return to Homepage
      </button>
    </div>
  );
}
const styles = {
  container: {
    margin: '20px auto',
    maxWidth: '800px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  subHeader: {
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    marginTop: '10px',
    marginBottom: '10px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '5px',
    color: '#fff',
    border: 'none',
    backgroundColor: '#007bff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    textAlign: 'left',
  },
  tableCell: {
    border: '1px solid #ccc',
    padding: '10px',
  },
};

