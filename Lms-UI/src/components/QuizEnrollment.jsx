import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function QuizEnrollmentManagement({ token, handleLogout }) {
    const navigate = useNavigate();
    const [quizEnrollments, setQuizEnrollments] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [newQuizEnrollment, setNewQuizEnrollment] = useState({
        quizId: '',
        enrollmentId: '',
        score: '',
    });

    const [updateQuizEnrollmentData, setUpdateQuizEnrollmentData] = useState({
        quizId: '',
        enrollmentId: '',
        score: '',
    });

    const [deleteQuizEnrollmentData, setDeleteQuizEnrollmentData] = useState({
        quizId: '',
        enrollmentId: '',
    });

    const [deleteQuizEnrollmentId, setDeleteQuizEnrollmentId] = useState('');
    const [deleteQuizEnrollmentEnrollmentId, setDeleteQuizEnrollmentEnrollmentId] = useState('');

    // Fetch permissions
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axios.get(
                    `https://localhost:7174/api/Permissions/8`,
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

    // Fetch quiz enrollments
    const fetchQuizEnrollments = async (quizId, enrollmentId) => {
        try {
            const response = await axios.get(
                `https://localhost:7174/api/QuizEnrollment/${quizId}/${enrollmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setQuizEnrollments([response.data]); // Set the specific quiz enrollment in the array
        } catch (err) {
            console.error('Error fetching quiz enrollment:', err);
        }
    };

    // Fetch enrollments for the user
    const fetchEnrollments = async () => {
        try {
            const response = await axios.get('https://localhost:7174/api/enrollment/my-enrollments', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEnrollments(response.data);
        } catch (err) {
            console.error('Error fetching enrollments:', err);
        }
    };

    // Fetch a specific quiz 
    const fetchQuiz = async () => {
        try {
            console.log(quizzes)
            const response = await axios.get(`https://localhost:7174/api/quiz/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            setQuizzes(response.data); // Set the single quiz in the quizzes array
        } catch (err) {
            console.error('Error fetching quiz:', err);
        }
    };

    // Fetch quiz enrollment by ID
    const fetchQuizEnrollmentById = async (quizId, enrollmentId) => {
        try {
            if (quizId && enrollmentId) {
                const response = await axios.get(
                    `https://localhost:7174/api/QuizEnrollment/${quizId}/${enrollmentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setQuizEnrollments([response.data]); // Fetch and set the specific quiz enrollment
            }
        } catch (err) {
            console.error('Error fetching quiz enrollment by ID:', err);
        }
    };

    // Add a new quiz enrollment
    const addQuizEnrollment = async (e) => {
        e.preventDefault();
        try {
            if (permissions.includes('QuizEnrollment.Create')) {
                await axios.post('https://localhost:7174/api/QuizEnrollment/create', newQuizEnrollment, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('Quiz Enrollment created successfully!');
                setNewQuizEnrollment({
                    quizId: '',
                    enrollmentId: '',
                    score: '',
                });
            } else {
                alert('You do not have permission to create a quiz enrollment.');
            }
        } catch (err) {
            console.error('Error creating quiz enrollment:', err);
        }
    };

    // Update an existing quiz enrollment
    const updateQuizEnrollment = async (e) => {
        e.preventDefault();
        try {
            if (permissions.includes('QuizEnrollment.Update')) {
                const { quizId, enrollmentId, score } = updateQuizEnrollmentData;
                await axios.put(
                    `https://localhost:7174/api/QuizEnrollment/update/${quizId}/${enrollmentId}`,
                    { score },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert('Quiz Enrollment updated successfully!');
                setUpdateQuizEnrollmentData({
                    quizId: '',
                    enrollmentId: '',
                    score: '',
                });
            } else {
                alert('You do not have permission to update a quiz enrollment.');
            }
        } catch (err) {
            console.error('Error updating quiz enrollment:', err);
        }
    };

    // Delete a quiz enrollment
    const deleteQuizEnrollment = async (e) => {
        e.preventDefault();
        try {
            if (permissions.includes('QuizEnrollment.Delete')) {
                const { quizId, enrollmentId } = deleteQuizEnrollmentData;
                await axios.delete(
                    `https://localhost:7174/api/QuizEnrollment/delete/${quizId}/${enrollmentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert('Quiz Enrollment deleted successfully!');
                setDeleteQuizEnrollmentData({
                    quizId: '',
                    enrollmentId: '',
                });
            } else {
                alert('You do not have permission to delete a quiz enrollment.');
            }
        } catch (err) {
            console.error('Error deleting quiz enrollment:', err);
        }
    };

    useEffect(() => {
        fetchQuiz();
        fetchEnrollments();
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Quiz Enrollment Management</h1>

            {/* Fetch Quiz Enrollment by ID */}
            <div style={styles.form}>
                <h2 style={styles.subHeader}>Fetch Quiz Enrollment by ID</h2>
                <input
                    type="number"
                    style={styles.input}
                    placeholder="Enter Quiz ID"
                    onChange={(e) => setDeleteQuizEnrollmentId(e.target.value)}
                />
                <input
                    type="number"
                    style={styles.input}
                    placeholder="Enter Enrollment ID"
                    onChange={(e) => setDeleteQuizEnrollmentEnrollmentId(e.target.value)}
                />
                <button
                    style={styles.button}
                    onClick={() => fetchQuizEnrollmentById(deleteQuizEnrollmentId, deleteQuizEnrollmentEnrollmentId)}
                    disabled={!deleteQuizEnrollmentId || !deleteQuizEnrollmentEnrollmentId}
                >
                    Fetch Quiz Enrollment
                </button>
            </div>

            {/* Quiz Enrollment List */}
            {quizEnrollments.length > 0 ? (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Row</th>
                            <th style={styles.tableHeader}>Quiz Title</th>
                            <th style={styles.tableHeader}>Enrollment Status</th>
                            <th style={styles.tableHeader}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizEnrollments.map((quizEnrollment, index) => (
                            <tr key={quizEnrollment.quizId + quizEnrollment.enrollmentId}>
                                <td style={styles.tableCell}>{index + 1}</td>
                                <td style={styles.tableCell}>{quizEnrollment.quiz?.quizTitle}</td>
                                <td style={styles.tableCell}>{quizEnrollment.enrollment?.status}</td>
                                <td style={styles.tableCell}>{quizEnrollment.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No quiz enrollments available.</p>
            )}

            {/* Add Quiz Enrollment */}
            {permissions.includes('QuizEnrollment.Create') && (
                <form onSubmit={addQuizEnrollment} style={styles.form}>
                    <h2 style={styles.subHeader}>Create Quiz Enrollment</h2>

                    <select
                        style={styles.input}
                        value={newQuizEnrollment.quizId}
                        onChange={(e) =>
                            setNewQuizEnrollment({ ...newQuizEnrollment, quizId: e.target.value })
                        }
                    >
                        <option value="">Select Quiz</option>
                        {quizzes.map((quiz) => (
                            <option key={quiz.quizId} value={quiz.quizId}>
                                {quiz.quizTitle}
                            </option>
                        ))}
                    </select>

                    <select
                        style={styles.input}
                        value={newQuizEnrollment.enrollmentId}
                        onChange={(e) =>
                            setNewQuizEnrollment({ ...newQuizEnrollment, enrollmentId: e.target.value })
                        }
                    >
                        <option value="">Select Enrollment</option>
                        {enrollments.map((enrollment) => (
                            <option key={enrollment.enrollmentId} value={enrollment.enrollmentId}>
                                {enrollment.coursePresent?.course?.courseName}
                            </option>
                        ))}
                    </select>

                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Score"
                        value={newQuizEnrollment.score}
                        onChange={(e) =>
                            setNewQuizEnrollment({ ...newQuizEnrollment, score: e.target.value })
                        }
                    />

                    <button type="submit" style={styles.button}>
                        Create Quiz Enrollment
                    </button>
                </form>
            )}

            {/* Update Quiz Enrollment */}
            {permissions.includes('QuizEnrollment.Update') && (
                <form onSubmit={updateQuizEnrollment} style={styles.form}>
                    <h2 style={styles.subHeader}>Update Quiz Enrollment</h2>

                    <select
                        style={styles.input}
                        value={updateQuizEnrollmentData.quizId}
                        onChange={(e) => {
                            const selectedQuizEnrollmentId = e.target.value;
                            const selectedQuizEnrollment = quizEnrollments.find(
                                (quizEnrollment) =>
                                    quizEnrollment.quizId === parseInt(selectedQuizEnrollmentId)
                            );
                            setUpdateQuizEnrollmentData(
                                selectedQuizEnrollment
                                    ? {
                                        quizId: selectedQuizEnrollment.quizId,
                                        enrollmentId: selectedQuizEnrollment.enrollmentId,
                                        score: selectedQuizEnrollment.score,
                                    }
                                    : { ...updateQuizEnrollmentData, quizId: selectedQuizEnrollmentId }
                            );
                        }}
                    >
                        <option value="">Select Quiz Enrollment to Update</option>
                        {quizEnrollments.map((quizEnrollment) => (
                            <option key={quizEnrollment.quizId + quizEnrollment.enrollmentId} value={quizEnrollment.quizId}>
                                {quizEnrollment.quiz?.quizTitle}
                            </option>
                        ))}
                    </select>

                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Score"
                        value={updateQuizEnrollmentData.score}
                        onChange={(e) =>
                            setUpdateQuizEnrollmentData({ ...updateQuizEnrollmentData, score: e.target.value })
                        }
                    />

                    <button type="submit" style={styles.button}>
                        Update Quiz Enrollment
                    </button>
                </form>
            )}

            {/* Delete Quiz Enrollment */}
            {permissions.includes('QuizEnrollment.Delete') && (
                <form onSubmit={deleteQuizEnrollment} style={styles.form}>
                    <h2 style={styles.subHeader}>Delete Quiz Enrollment</h2>

                    <select
                        style={styles.input}
                        value={deleteQuizEnrollmentId}
                        onChange={(e) => setDeleteQuizEnrollmentId(e.target.value)}
                    >
                        <option value="">Select Quiz Enrollment to Delete</option>
                        {quizEnrollments.map((quizEnrollment) => (
                            <option key={quizEnrollment.quizId + quizEnrollment.enrollmentId} value={quizEnrollment.quizId}>
                                {quizEnrollment.quiz?.quizTitle}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        style={{ ...styles.button, backgroundColor: '#dc3545' }}
                    >
                        Delete Quiz Enrollment
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
