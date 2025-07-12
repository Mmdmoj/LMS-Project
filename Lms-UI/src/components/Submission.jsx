import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SubmissionManagement({ token, handleLogout }) {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [newSubmission, setNewSubmission] = useState({
        assignmentId: '',
        enrollmentId: '',
        submissionDate: '',
        grade: '',
        feedback: '',
    });

    const [updateSubmissionData, setUpdateSubmissionData] = useState({
        submissionId: '',
        assignmentId: '',
        enrollmentId: '',
        submissionDate: '',
        grade: '',
        feedback: '',
    });

    const [deleteSubmissionId, setDeleteSubmissionId] = useState('');

    // Fetch permissions
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axios.get(
                    `https://localhost:7174/api/Permissions/5`,
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

    // Fetch a specific submission by submissionId
    const fetchSubmissionById = async (submissionId) => {
        try {
            const response = await axios.get(`https://localhost:7174/api/Submission/${submissionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSubmissions([response.data]); // Set the single submission in the submissions array
        } catch (err) {
            console.error('Error fetching submission:', err);
        }
    };

    // Fetch all Assignment
    const fetchAssignment = async () => {
        try {
            const response = await axios.get(`https://localhost:7174/api/Assignment/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Assuming response.data is already an array of assignments
            setAssignments(response.data);
        } catch (err) {
            console.error('Error fetching assignments:', err);
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

    // Add a new submission
    const addSubmission = async (e) => {
        e.preventDefault();
        try {
            console.log(newSubmission)
            if (permissions.includes('Submission.Create')) {
                await axios.post('https://localhost:7174/api/Submission/create', newSubmission, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('Submission created successfully!');
                setNewSubmission({
                    assignmentId: '',
                    enrollmentId: '',
                    submissionDate: '',
                    grade: '',
                    feedback: '',
                });
                fetchSubmissionById();
            } else {
                alert('You do not have permission to create a submission.');
            }
        } catch (err) {
            console.error('Error creating submission:', err);
        }
    };

    // Update an existing submission
    const updateSubmission = async (e) => {
        e.preventDefault();
        try {
            if (permissions.includes('Submission.Update')) {
                await axios.put(
                    `https://localhost:7174/api/Submission/update/${updateSubmissionData.submissionId}`,
                    updateSubmissionData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert('Submission updated successfully!');
                setUpdateSubmissionData({
                    submissionId: '',
                    assignmentId: '',
                    enrollmentId: '',
                    submissionDate: '',
                    grade: '',
                    feedback: '',
                });
                fetchSubmissionById();
            } else {
                alert('You do not have permission to update a submission.');
            }
        } catch (err) {
            console.error('Error updating submission:', err);
        }
    };

    // Delete a submission
    const deleteSubmission = async (e) => {
        e.preventDefault();
        try {
            if (permissions.includes('Submission.Delete')) {
                await axios.delete(
                    `https://localhost:7174/api/Submission/delete/${deleteSubmissionId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert('Submission deleted successfully!');
                setDeleteSubmissionId('');
                fetchSubmissionById();
            } else {
                alert('You do not have permission to delete a submission.');
            }
        } catch (err) {
            console.error('Error deleting submission:', err);
        }
    };
    useEffect(() => {
        fetchAssignment();
        fetchEnrollments();
    }, []);


    return (

        <div style={styles.container}>
            <h1 style={styles.header}>Submission Management</h1>

            {/* Fetch Submission by ID */}
            <div style={styles.form}>
                <h2 style={styles.subHeader}>Fetch Submission by ID</h2>
                <input
                    type="number"
                    style={styles.input}
                    placeholder="Enter Submission ID"
                    onChange={(e) => setDeleteSubmissionId(e.target.value)} // Reuse deleteSubmissionId state for simplicity
                />
                <button
                    style={styles.button}
                    onClick={() => fetchSubmissionById(deleteSubmissionId)}
                    disabled={!deleteSubmissionId}
                >
                    Fetch Submission
                </button>
            </div>

            {/* Submission List */}
            {submissions.length > 0 ? (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Row</th>
                            <th style={styles.tableHeader}>Assignment Title</th>
                            <th style={styles.tableHeader}>Enrollment Status</th>
                            <th style={styles.tableHeader}>Submission Date</th>
                            <th style={styles.tableHeader}>Grade</th>
                            <th style={styles.tableHeader}>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission, index) => (
                            <tr key={submission.submissionId}>
                                <td style={styles.tableCell}>{index + 1}</td>
                                <td style={styles.tableCell}>{submission.assignment?.assignmentTitle}</td>
                                <td style={styles.tableCell}>{submission.enrollment?.status}</td>
                                <td style={styles.tableCell}>{submission.submissionDate}</td>
                                <td style={styles.tableCell}>{submission.grade}</td>
                                <td style={styles.tableCell}>{submission.feedback}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No submissions available.</p>
            )}

            {/* Add Submission */}
            {permissions.includes('Submission.Create') && (
                <form onSubmit={addSubmission} style={styles.form}>
                    <h2 style={styles.subHeader}>Create Submission</h2>

                    <select
                        style={styles.input}
                        value={newSubmission.assignmentId}
                        onChange={(e) =>
                            setNewSubmission({ ...newSubmission, assignmentId: e.target.value })
                        }
                    >
                        <option value="">Select Assignment</option>
                        {assignments.map((assignment) => (
                            <option key={assignment.assignmentId} value={assignment.assignmentId}>
                                {assignment.assignmentTitle}
                            </option>
                        ))}
                    </select>

                    <select
                        style={styles.input}
                        value={newSubmission.enrollmentId}
                        onChange={(e) =>
                            setNewSubmission({ ...newSubmission, enrollmentId: e.target.value })
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
                        type="date"
                        placeholder="Submission Date"
                        value={newSubmission.submissionDate}
                        onChange={(e) =>
                            setNewSubmission({ ...newSubmission, submissionDate: e.target.value })
                        }
                        required
                    />
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Grade"
                        value={newSubmission.grade}
                        onChange={(e) => setNewSubmission({ ...newSubmission, grade: e.target.value })}
                    />
                    <textarea
                        style={styles.input}
                        placeholder="Feedback"
                        value={newSubmission.feedback}
                        onChange={(e) =>
                            setNewSubmission({ ...newSubmission, feedback: e.target.value })
                        }
                    />

                    <button type="submit" style={styles.button}>
                        Create Submission
                    </button>
                </form>
            )}

            {/* Update Submission */}
            {permissions.includes('Submission.Update') && (
                <form onSubmit={updateSubmission} style={styles.form}>
                    <h2 style={styles.subHeader}>Update Submission</h2>

                    <select
                        style={styles.input}
                        value={updateSubmissionData.submissionId}
                        onChange={(e) => {
                            const selectedSubmissionId = e.target.value;
                            const selectedSubmission = submissions.find(
                                (submission) =>
                                    submission.submissionId === parseInt(selectedSubmissionId)
                            );
                            setUpdateSubmissionData(
                                selectedSubmission
                                    ? {
                                        submissionId: selectedSubmission.submissionId,
                                        assignmentId: selectedSubmission.assignmentId,
                                        enrollmentId: selectedSubmission.enrollmentId,
                                        submissionDate: selectedSubmission.submissionDate,
                                        grade: selectedSubmission.grade,
                                        feedback: selectedSubmission.feedback,
                                    }
                                    : { ...updateSubmissionData, submissionId: selectedSubmissionId }
                            );
                        }}
                    >
                        <option value="">Select Submission to Update</option>
                        {submissions.map((submission) => (
                            <option key={submission.submissionId} value={submission.submissionId}>
                                {submission.assignmentId}
                            </option>
                        ))}
                    </select>

                    <input
                        style={styles.input}
                        type="date"
                        placeholder="Submission Date"
                        value={updateSubmissionData.submissionDate}
                        onChange={(e) =>
                            setUpdateSubmissionData({
                                ...updateSubmissionData,
                                submissionDate: e.target.value,
                            })
                        }
                    />
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Grade"
                        value={updateSubmissionData.grade}
                        onChange={(e) =>
                            setUpdateSubmissionData({ ...updateSubmissionData, grade: e.target.value })
                        }
                    />
                    <textarea
                        style={styles.input}
                        placeholder="Feedback"
                        value={updateSubmissionData.feedback}
                        onChange={(e) =>
                            setUpdateSubmissionData({ ...updateSubmissionData, feedback: e.target.value })
                        }
                    />

                    <button type="submit" style={styles.button}>
                        Update Submission
                    </button>
                </form>
            )}

            {/* Delete Submission */}
            {permissions.includes('Submission.Delete') && (
                <form onSubmit={deleteSubmission} style={styles.form}>
                    <h2 style={styles.subHeader}>Delete Submission</h2>

                    <select
                        style={styles.input}
                        value={deleteSubmissionId}
                        onChange={(e) => setDeleteSubmissionId(e.target.value)}
                    >
                        <option value="">Select Submission to Delete</option>
                        {submissions.map((submission) => (
                            <option key={submission.submissionId} value={submission.submissionId}>
                                {submission.assignmentId}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        style={{ ...styles.button, backgroundColor: '#dc3545' }}
                    >
                        Delete Submission
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


