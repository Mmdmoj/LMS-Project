import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CoursePresent({ token, handleLogout }) {
  const navigate = useNavigate();
  const [coursePresents, setCoursePresents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newCoursePresent, setNewCoursePresent] = useState({
    courseId: '',
    startDate: '',
    endDate: '',
    maxEnrollments: '',
    CurrentEnrollments: '',
    progressTrackingEnabled: true,
  });

  const [updateCoursePresentData, setUpdateCoursePresentData] = useState({
    coursePresentId: '',
    courseId: '',
    startDate: '',
    endDate: '',
    maxEnrollments: '',
    progressTrackingEnabled: true,
  });

  const [deleteCoursePresentId, setDeleteCoursePresentId] = useState('');

  // Fetch permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7174/api/Permissions/6`,
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

  // Fetch course presents
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

  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://localhost:7174/api/Course/view', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  // Add a new course present
  const addCoursePresent = async (e) => {
    e.preventDefault();
    try {
      if (permissions.includes('CoursePresent.Create')) {
        await axios.post('https://localhost:7174/api/coursepresent/create', newCoursePresent, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Course presentation created successfully!');
        setNewCoursePresent({
          courseId: '',
          startDate: '',
          endDate: '',
          maxEnrollments: '',
          progressTrackingEnabled: true,
        });
        fetchCoursePresents();
      } else {
        alert('You do not have permission to create a course presentation.');
      }
    } catch (err) {
      console.error('Error creating course presentation:', err);
    }
  };

  // Update an existing course present
  const updateCoursePresent = async (e) => {
    e.preventDefault();
    try {
      if (permissions.includes('CoursePresent.Update')) {
        await axios.put(
          `https://localhost:7174/api/coursepresent/update/${updateCoursePresentData.coursePresentId}`,
          updateCoursePresentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Course presentation updated successfully!');
        setUpdateCoursePresentData({
          coursePresentId: '',
          courseId: '',
          startDate: '',
          endDate: '',
          maxEnrollments: '',
          progressTrackingEnabled: true,
        });
        fetchCoursePresents();
      } else {
        alert('You do not have permission to update a course presentation.');
      }
    } catch (err) {
      console.error('Error updating course presentation:', err);
    }
  };

  // Delete a course present
  const deleteCoursePresent = async (e) => {
    e.preventDefault();
    try {
      if (permissions.includes('CoursePresent.Delete')) {
        await axios.delete(
          `https://localhost:7174/api/coursepresent/delete/${deleteCoursePresentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Course presentation deleted successfully!');
        setDeleteCoursePresentId('');
        fetchCoursePresents();
      } else {
        alert('You do not have permission to delete a course presentation.');
      }
    } catch (err) {
      console.error('Error deleting course presentation:', err);
    }
  };
  useEffect(() => {
    fetchCoursePresents();
    fetchCourses(); // Fetch the complete list of courses
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Course Present Management</h1>

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
              <th style={styles.tableHeader}>Progress Tracking</th>
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
                <td style={styles.tableCell}>
                  {present.progressTrackingEnabled ? 'Enabled' : 'Disabled'}
                </td>
                <td style={styles.tableCell}>{present.course?.instructor?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No course presentations available.</p>
      )}

      {/* Add Course Present */}
      {permissions.includes('CoursePresent.Create') && (
        <form onSubmit={addCoursePresent} style={styles.form}>
          <h2 style={styles.subHeader}>Create Course Present</h2>

          {/* Course Dropdown */}
          <select
            style={styles.input}
            value={newCoursePresent.courseId}
            onChange={(e) =>
              setNewCoursePresent({ ...newCoursePresent, courseId: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select a Course
            </option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </select>
          {/* Start Date */}
          <input
            style={styles.input}
            type="date"
            placeholder="Start Date"
            value={newCoursePresent.startDate}
            onChange={(e) =>
              setNewCoursePresent({ ...newCoursePresent, startDate: e.target.value })
            }
            required
          />

          {/* End Date */}
          <input
            style={styles.input}
            type="date"
            placeholder="End Date"
            value={newCoursePresent.endDate}
            onChange={(e) =>
              setNewCoursePresent({ ...newCoursePresent, endDate: e.target.value })
            }
            required
          />

          {/* Max Enrollments */}
          <input
            style={styles.input}
            type="number"
            placeholder="Max Enrollments"
            value={newCoursePresent.maxEnrollments}
            onChange={(e) =>
              setNewCoursePresent({
                ...newCoursePresent,
                maxEnrollments: e.target.value,
              })
            }
            required
          />

          {/* Progress Tracking */}
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={newCoursePresent.progressTrackingEnabled}
              onChange={(e) =>
                setNewCoursePresent({
                  ...newCoursePresent,
                  progressTrackingEnabled: e.target.checked,
                })
              }
            />
            Enable Progress Tracking
          </label>

          {/* Submit Button */}
          <button type="submit" style={styles.button}>
            Create Course Present
          </button>
        </form>
      )}
      {/* Update Course Present */}
      {permissions.includes('CoursePresent.Update') && (
        <form onSubmit={updateCoursePresent} style={styles.form}>
          <h2 style={styles.subHeader}>Update Course Present</h2>

          {/* Dropdown to select a course presentation */}
          <select
            style={styles.input}
            value={updateCoursePresentData.coursePresentId}
            onChange={(e) => {
              const selectedCoursePresentId = e.target.value;
              const selectedCoursePresent = coursePresents.find(
                (cp) => cp.coursePresentId === parseInt(selectedCoursePresentId)
              );
              setUpdateCoursePresentData(
                selectedCoursePresent
                  ? {
                    coursePresentId: selectedCoursePresent.coursePresentId,
                    courseId: selectedCoursePresent.courseId,
                    startDate: selectedCoursePresent.startDate,
                    endDate: selectedCoursePresent.endDate,
                    maxEnrollments: selectedCoursePresent.maxEnrollments,
                    progressTrackingEnabled:
                      selectedCoursePresent.progressTrackingEnabled,
                  }
                  : { ...updateCoursePresentData, coursePresentId: selectedCoursePresentId }
              );
            }}
          >
            <option value="">Select Course Presentation to Update</option>
            {coursePresents.map((cp) => (
              <option key={cp.coursePresentId} value={cp.coursePresentId}>
                {cp.course?.courseName}
              </option>
            ))}
          </select>

          {/* Course ID */}
          <input
            style={styles.input}
            type="text"
            placeholder="Cours Name"
            value={updateCoursePresentData.courseId}

            onChange={(e) =>
              setUpdateCoursePresentData({
                ...updateCoursePresentData,
                courseId: e.target.value,
              })
            }
            required
          />

          {/* Start Date */}
          <input
            style={styles.input}
            type="date"
            placeholder="Start Date"
            value={updateCoursePresentData.startDate}
            onChange={(e) =>
              setUpdateCoursePresentData({
                ...updateCoursePresentData,
                startDate: e.target.value,
              })
            }
            required
          />

          {/* End Date */}
          <input
            style={styles.input}
            type="date"
            placeholder="End Date"
            value={updateCoursePresentData.endDate}
            onChange={(e) =>
              setUpdateCoursePresentData({
                ...updateCoursePresentData,
                endDate: e.target.value,
              })
            }
            required
          />

          {/* Max Enrollments */}
          <input
            style={styles.input}
            type="number"
            placeholder="Max Enrollments"
            value={updateCoursePresentData.maxEnrollments}
            onChange={(e) =>
              setUpdateCoursePresentData({
                ...updateCoursePresentData,
                maxEnrollments: e.target.value,
              })
            }
            required
          />

          {/* Progress Tracking */}
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={updateCoursePresentData.progressTrackingEnabled}
              onChange={(e) =>
                setUpdateCoursePresentData({
                  ...updateCoursePresentData,
                  progressTrackingEnabled: e.target.checked,
                })
              }
            />
            Enable Progress Tracking
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            style={{ ...styles.button, backgroundColor: '#007bff' }}
          >
            Update Course Present
          </button>
        </form>
      )}
      {permissions.includes('CoursePresent.Delete') && (
        <form onSubmit={deleteCoursePresent} style={styles.form}>
          <h2 style={styles.subHeader}>Delete Course Presentation</h2>

          {/* Dropdown to select a course presentation */}
          <select
            style={styles.input}
            value={deleteCoursePresentId}
            onChange={(e) => setDeleteCoursePresentId(e.target.value)}
          >
            <option value="">Select Course Presentation to Delete</option>
            {coursePresents.map((cp) => (
              <option key={cp.coursePresentId} value={cp.coursePresentId}>
                {`Course: ${cp.course?.courseName || `ID ${cp.courseId}`}, Start: ${cp.startDate}`}
              </option>
            ))}
          </select>

          {/* Delete Button */}
          <button
            type="submit"
            style={{ ...styles.button, backgroundColor: '#dc3545' }}
          >
            Delete Course Presentation
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
