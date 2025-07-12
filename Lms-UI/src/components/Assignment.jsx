import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AssignmentManagement({ token, handleLogout }) {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [coursePresents, setCoursePresents] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [newAssignment, setNewAssignment] = useState({
        coursePresentId: '',
        assignmentTitle: '',
        assignmentDescription: '',
        dueDate: '',
        maxScore: '',
    });

    const [updateAssignmentData, setUpdateAssignmentData] = useState({
        assignmentId: '',
        coursePresentId: '',
        assignmentTitle: '',
        assignmentDescription: '',
        dueDate: '',
        maxScore: '',
    });

    const [deleteAssignmentId, setDeleteAssignmentId] = useState('');

    // Fetch permissions
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axios.get(
                    `https://localhost:7174/api/Permissions/3`,
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

    // Fetch a specific assignment by assignmentId
    const fetchAssignmentById = async (assignmentId) => {
        try {
            const response = await axios.get(`https://localhost:7174/api/Assignment/${assignmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAssignments([response.data]); // Set the single assignment in the assignments array
        } catch (err) {
            console.error('Error fetching assignment:', err);
        }
    };

    // Fetch course presents
    const fetchCoursePresents = async () => {
        try {
            const response = await axios.get('https://localhost:7174/api/coursepresent/view', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCoursePresents(response.data); // Response should include courseName and currentEnrollments
        } catch (err) {
            console.error('Error fetching course presents:', err);
        }
    };

    // Add a new assignment
    const addAssignment = async (e) => {
        e.preventDefault();
        try {
            console.log(newAssignment)
            if (permissions.includes('Assignment.Create')) {
                await axios.post('https://localhost:7174/api/Assignment/create', newAssignment, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('Assignment created successfully!');
                setNewAssignment({
                    coursePresentId: '',
                    assignmentTitle: '',
                    assignmentDescription: '',
                    dueDate: '',
                    maxScore: '',
                });
                fetchAssignmentById();
            } else {
                alert('You do not have permission to create an assignment.');
            }
        } catch (err) {
            console.error('Error creating assignment:', err);
        }
    };

    // Update an existing assignment
    const updateAssignment = async (e) => {
        e.preventDefault();
        try {
            console.log(updateAssignmentData)
            if (permissions.includes('Assignment.Update')) {
                await axios.put(
                    `https://localhost:7174/api/Assignment/update/${updateAssignmentData.assignmentId}`,
                    updateAssignmentData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert('Assignment updated successfully!');
                setUpdateAssignmentData({
                    assignmentId: '',
                    coursePresentId: '',
                    assignmentTitle: '',
                    assignmentDescription: '',
                    dueDate: '',
                    maxScore: '',
                });
                fetchAssignmentById();
            } else {
                alert('You do not have permission to update an assignment.');
            }
        } catch (err) {
            console.error('Error updating assignment:', err);
        }
    };

    // Delete an assignment
    const deleteAssignment = async (e) => {
        e.preventDefault();
        try {
            if (permissions.includes('Assignment.Delete')) {
                await axios.delete(
                    `https://localhost:7174/api/Assignment/delete/${deleteAssignmentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert('Assignment deleted successfully!');
                setDeleteAssignmentId('');
                fetchAssignmentById();
            } else {
                alert('You do not have permission to delete an assignment.');
            }
        } catch (err) {
            console.error('Error deleting assignment:', err);
        }
    };

    useEffect(() => {
        fetchCoursePresents();
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Assignment Management</h1>

            {/* Fetch Assignment by ID */}
            <div style={styles.form}>
                <h2 style={styles.subHeader}>Fetch Assignment by ID</h2>
                <input
                    type="number"
                    style={styles.input}
                    placeholder="Enter Assignment ID"
                    onChange={(e) => setDeleteAssignmentId(e.target.value)} // Reuse deleteAssignmentId state for simplicity
                />
                <button
                    style={styles.button}
                    onClick={() => fetchAssignmentById(deleteAssignmentId)}
                    disabled={!deleteAssignmentId}
                >
                    Fetch Assignment
                </button>
            </div>

            {/* Assignment List */}
            {assignments.length > 0 ? (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Row</th>
                            <th style={styles.tableHeader}>Assignment Title</th>
                            <th style={styles.tableHeader}>Assignment Description</th>
                            <th style={styles.tableHeader}>Due Date</th>
                            <th style={styles.tableHeader}>Max Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment, index) => (
                            <tr key={assignment.assignmentId}>
                                <td style={styles.tableCell}>{index + 1}</td>
                                <td style={styles.tableCell}>{assignment.assignmentTitle}</td>
                                <td style={styles.tableCell}>{assignment.assignmentDescription}</td>
                                <td style={styles.tableCell}>{assignment.dueDate}</td>
                                <td style={styles.tableCell}>{assignment.maxScore}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No assignments available.</p>
            )}

            {/* Add Assignment */}
            {permissions.includes('Assignment.Create') && (
                <form onSubmit={addAssignment} style={styles.form}>
                    <h2 style={styles.subHeader}>Create Assignment</h2>

                    {/* Course Present ID */}
                    <select
                        style={styles.input}
                        value={newAssignment.coursePresentId}
                        onChange={(e) =>
                            setNewAssignment({ ...newAssignment, coursePresentId: e.target.value })
                        }
                    >
                        <option value="">Select Course</option>
                        {coursePresents.map((course) => (
                            <option key={course.coursePresentId} value={course.coursePresentId}>
                                {course.course?.courseName}
                            </option>
                        ))}
                    </select>

                    {/* Assignment Title */}
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Assignment Title"
                        value={newAssignment.assignmentTitle}
                        onChange={(e) =>
                            setNewAssignment({ ...newAssignment, assignmentTitle: e.target.value })
                        }
                        required
                    />

                    {/* Assignment Description */}
                    <textarea
                        style={styles.input}
                        placeholder="Assignment Description"
                        value={newAssignment.assignmentDescription}
                        onChange={(e) =>
                            setNewAssignment({ ...newAssignment, assignmentDescription: e.target.value })
                        }
                        required
                    />

                    {/* Due Date */}
                    <input
                        style={styles.input}
                        type="date"
                        placeholder="Due Date"
                        value={newAssignment.dueDate}
                        onChange={(e) =>
                            setNewAssignment({ ...newAssignment, dueDate: e.target.value })
                        }
                        required
                    />
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Max Score"
                        value={newAssignment.maxScore}
                        onChange={(e) =>
                            setNewAssignment({ ...newAssignment, maxScore: e.target.value })
                        }
                        required
                    />

                    <button type="submit" style={styles.button}>
                        Create Assignment
                    </button>
                </form>
            )}

            {/* Update Assignment */}
            {permissions.includes('Assignment.Update') && (
                <form onSubmit={updateAssignment} style={styles.form}>
                    <h2 style={styles.subHeader}>Update Assignment</h2>

                    {/* Dropdown to select an assignment */}
                    <select
                        style={styles.input}
                        value={updateAssignmentData.assignmentId}
                        onChange={(e) => {
                            const selectedAssignmentId = e.target.value;
                            const selectedAssignment = assignments.find(
                                (assignment) =>
                                    assignment.assignmentId === parseInt(selectedAssignmentId)
                            );
                            setUpdateAssignmentData(
                                selectedAssignment
                                    ? {
                                        assignmentId: selectedAssignment.assignmentId,
                                        assignmentTitle: selectedAssignment.assignmentTitle,
                                        assignmentDescription: selectedAssignment.assignmentDescription,
                                        dueDate: selectedAssignment.dueDate,
                                        maxScore: selectedAssignment.maxScore,
                                    }
                                    : { ...updateAssignmentData, assignmentId: selectedAssignmentId }
                            );
                        }}
                    >
                        <option value="">Select Assignment to Update</option>
                        {assignments.map((assignment) => (
                            <option key={assignment.assignmentId} value={assignment.assignmentId}>
                                {assignment.assignmentTitle}
                            </option>
                        ))}
                    </select>

                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Assignment Title"
                        value={updateAssignmentData.assignmentTitle}
                        onChange={(e) =>
                            setUpdateAssignmentData({
                                ...updateAssignmentData,
                                assignmentTitle: e.target.value,
                            })
                        }
                        required
                    />

                    <textarea
                        style={styles.input}
                        placeholder="Assignment Description"
                        value={updateAssignmentData.assignmentDescription}
                        onChange={(e) =>
                            setUpdateAssignmentData({
                                ...updateAssignmentData,
                                assignmentDescription: e.target.value,
                            })
                        }
                        required
                    />

                    <input
                        style={styles.input}
                        type="date"
                        placeholder="Due Date"
                        value={updateAssignmentData.dueDate}
                        onChange={(e) =>
                            setUpdateAssignmentData({ ...updateAssignmentData, dueDate: e.target.value })
                        }
                        required
                    />
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Max Scorev"
                        value={updateAssignmentData.maxScore}
                        onChange={(e) =>
                            setUpdateAssignmentData({ ...updateAssignmentData, maxScore: e.target.value })
                        }
                        required
                    />

                    <button type="submit" style={styles.button}>
                        Update Assignment
                    </button>
                </form>
            )}

            {/* Delete Assignment */}
            {permissions.includes('Assignment.Delete') && (
                <form onSubmit={deleteAssignment} style={styles.form}>
                    <h2 style={styles.subHeader}>Delete Assignment</h2>

                    <select
                        style={styles.input}
                        value={deleteAssignmentId}
                        onChange={(e) => setDeleteAssignmentId(e.target.value)}
                    >
                        <option value="">Select Assignment to Delete</option>
                        {assignments.map((assignment) => (
                            <option key={assignment.assignmentId} value={assignment.assignmentId}>
                                {assignment.assignmentTitle}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        style={{ ...styles.button, backgroundColor: '#dc3545' }}
                    >
                        Delete Assignment
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
