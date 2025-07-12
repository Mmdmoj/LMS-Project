import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Enrollment({ token, handleLogout }) {
  const navigate = useNavigate();
  const [coursePresents, setCoursePresents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [permissions, setPermissions] = useState([]); // Stores permissions from API
  const [newEnrollment, setNewEnrollment] = useState({
    CourseId: '',
    Status: '',
  });
  const [unenrollCourseId, setUnenrollCourseId] = useState('');

  // Fetch permissions for the current user
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7174/api/Permissions/7`, // Update to your actual endpoint
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Permissions fetched:', response.data);
        const permissionNames = response.data.map((perm) => perm.permissionName);
        setPermissions(permissionNames);
      } catch (err) {
        console.error('Error fetching permissions:', err);
      }
    };

    fetchPermissions();
  }, [token]);


  const fetchCoursePresents = async () => {
    try {
      const response = await axios.get('https://localhost:7174/api/coursepresent/view', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setCoursePresents(response.data); // Response should include courseName and currentEnrollments
    } catch (err) {
      console.error('Error fetching course presents:', err);
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

  // Add a new enrollment
  const enrollCourse = async (e) => {
    e.preventDefault();
    try {
      console.log(newEnrollment);
      if (permissions.includes('Enrollment.Create')) {
        await axios.post(
          'https://localhost:7174/api/enrollment/enroll',
          newEnrollment,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Enrollment successful!');
        setNewEnrollment({
          CourseId: '',
          Status: '',
        });
        fetchEnrollments(); // Refresh enrollments
      } else {
        alert('You do not have permission to enroll in a course.');
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
    }
  };

  // Unenroll from a course
  const unenrollCourse = async (e) => {
    e.preventDefault();
    try {
      if (permissions.includes('Enrollment.Delete')) {
        await axios.delete(`https://localhost:7174/api/enrollment/unenroll/${unenrollCourseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Unenrolled successfully!');
        setUnenrollCourseId('');
        fetchEnrollments(); // Refresh enrollments
      } else {
        alert('You do not have permission to unenroll from a course.');
      }
    } catch (err) {
      console.error('Error unenrolling from course:', err);
    }
  };

  // Fetch enrollments on component mount
  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Enrollment Management</h1>

      {/* View Course Presents */}
      <button onClick={fetchCoursePresents} style={styles.button}>
        View Course Presents
      </button>

      {/* Course Present List */}
      {coursePresents.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Row</th>
              <th style={styles.tableHeader}>Course Name</th>
              <th style={styles.tableHeader}>Start Date</th>
              <th style={styles.tableHeader}>End Date</th>
              <th style={styles.tableHeader}>Max Enrollments</th>
              <th style={styles.tableHeader}>Current Enrollments</th>
            </tr>
          </thead>
          <tbody>
            {coursePresents.map((present, index) => (
              <tr key={present.coursePresentId}>
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>{present.course?.courseName}</td> {/* Display courseName */}
                <td style={styles.tableCell}>{present.startDate}</td>
                <td style={styles.tableCell}>{present.endDate}</td>
                <td style={styles.tableCell}>{present.maxEnrollments}</td>
                <td style={styles.tableCell}>{present.currentEnrollments}</td> {/* Display currentEnrollments */}
                <td style={styles.tableCell}>{present.course?.instructor?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No course presentations available.</p>
      )}
      {/* Enroll in a Course Form */}
      {permissions.includes('Enrollment.Create') && (
        <form onSubmit={enrollCourse} style={styles.form}>
          <h2 style={styles.subHeader}>Enroll in a Course</h2>
          <select
            style={styles.input}
            value={newEnrollment.CourseId} // Use CourseId instead
            onChange={(e) =>
              setNewEnrollment({ ...newEnrollment, CourseId: e.target.value }) // Use CourseId
            }
            required
          >
            <option value="" disabled>
              Select a Course
            </option>
            {coursePresents.map((cp, index) => (
              <option key={index} value={cp.coursePresentId}>
                {cp.course?.courseName}
              </option>
            ))}
          </select>


          <input
            style={styles.input}
            type="text"
            placeholder="Status"
            value="Active"
            readOnly
            onChange={(e) =>
              setNewEnrollment({ ...newEnrollment, Status: 'Active' })
            }
            required
          />
          <button type="submit" style={{ ...styles.button, backgroundColor: '#28a745' }}>
            Enroll
          </button>
        </form>
      )}

      {/* Fetch Enrollments Button */}
      <button
        onClick={fetchEnrollments}
        style={{ ...styles.button, backgroundColor: '#007bff' }}
      >
        View My Enrollments
      </button>


      {/* Enrollment List */}
      {enrollments.length > 0 ? (
        <div style={styles.enrollmentList}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Row</th>
                <th style={styles.tableHeader}>Course Name</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Start Date</th>
                <th style={styles.tableHeader}>Max Enrollments</th>
                <th style={styles.tableHeader}>Current Enrollments</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment, index) => (
                <tr key={enrollment.coursePresentId}>
                  <td style={styles.tableCell}>{index + 1}</td>
                  {/* Show CourseName if available, otherwise fallback to CourseID */}
                  <td style={styles.tableCell}>
                    {enrollment.coursePresent?.course?.courseName}
                  </td>
                  <td style={styles.tableCell}>{enrollment.status}</td>
                  <td style={styles.tableCell}>{enrollment.coursePresent?.startDate}</td>
                  <td style={styles.tableCell}>{enrollment.coursePresent?.maxEnrollments}</td>
                  <td style={styles.tableCell}>{enrollment.coursePresent?.currentEnrollments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No enrollments available.</p>
      )}

      {/* Unenroll from a Course Form */}
      {permissions.includes('Enrollment.Delete') && (
        <form onSubmit={unenrollCourse} style={styles.form}>
          <h2 style={styles.subHeader}>Unenroll from a Course</h2>
          <select
            style={styles.input}
            value={unenrollCourseId}
            onChange={(e) => setUnenrollCourseId(e.target.value)}
          >
            <option value="">Select Course to Unenroll</option>
            {enrollments.map((enrollment) => (
              <option key={enrollment.coursePresentId} value={enrollment.coursePresentId}>
                {enrollment.coursePresent?.course?.courseName}
              </option>
            ))}
          </select>
          <button type="submit" style={{ ...styles.button, backgroundColor: '#dc3545' }}>
            Unenroll
          </button>
        </form>
      )}

      {/* Logout and Navigate Buttons */}
      <button onClick={handleLogout} style={{ ...styles.button, backgroundColor: '#dc3545' }}>
        Logout
      </button>
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
  courseList: {
    marginBottom: '20px',
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
