import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Course({ token, handleLogout }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [permissions, setPermissions] = useState([]); // Stores permissions from API
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    description: '',
    isPublished: false,
    duration: '',
    category: '',
  });
  const [updateCourseData, setUpdateCourseData] = useState({
    courseId: '',
    courseName: '',
    description: '',
    isPublished: false,
    duration: '',
    category: '',
  });
  const [deleteCourseName, setDeleteCourseName] = useState('');

  // Fetch permissions for the current user
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7174/api/Permissions/1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Permissions fetched:', response.data);
        // Extract only the `permissionName` values
        const permissionNames = response.data.map((perm) => perm.permissionName);
        setPermissions(permissionNames);
      } catch (err) {
        console.error('Error fetching permissions:', err);
      }
    };

    fetchPermissions();
  }, [token]);


  // Fetch courses from the server
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

  // Add a new course
  const addCourse = async (e) => {
    e.preventDefault();
    try {
      if (permissions.includes('Course.Create')) {
        await axios.post(
          'https://localhost:7174/api/course/create',
          newCourse,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Course created successfully!');
        setNewCourse({
          courseName: '',
          description: '',
          isPublished: false,
          duration: '',
          category: '',
        });
        fetchCourses(); // Refresh courses
      } else {
        alert('You do not have permission to create a course.');
      }
    } catch (err) {
      console.error('Error creating course:', err);
    }
  };

  // Update an existing course
  const updateCourse = async (e) => {
    e.preventDefault();
    try {
      if (permissions.includes('Course.Update')) {
        await axios.put(
          'https://localhost:7174/api/Course/update',
          updateCourseData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Course updated successfully!');
        setUpdateCourseData({
          courseId: '',
          courseName: '',
          description: '',
          isPublished: false,
          duration: '',
          category: '',
        });
        fetchCourses(); // Refresh courses
      } else {
        alert('You do not have permission to update a course.');
      }
    } catch (err) {
      console.error('Error updating course:', err);
    }
  };

  // Delete a course
  const deleteCourse = async (e) => {
    e.preventDefault();
    try {
      if (permissions.includes('Course.Delete')) {
        const course = courses.find((c) => c.courseName === deleteCourseName);
        if (!course) {
          alert('Course not found.');
          return;
        }
        await axios.delete(`https://localhost:7174/api/Course/delete/${course.courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Course deleted successfully!');
        setDeleteCourseName('');
        fetchCourses(); // Refresh courses
      } else {
        alert('You do not have permission to delete a course.');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Course Management</h1>

      {/* Fetch Courses Button (Visible to all roles) */}
      <button onClick={fetchCourses} style={{ ...styles.button, backgroundColor: '#007bff' }}>
        View Courses
      </button>

      {/* Course List */}
      {courses.length > 0 ? (
        <div style={styles.courseList}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Row</th>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Description</th>
                <th style={styles.tableHeader}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.courseId}>
                  <td style={styles.tableCell}>{index + 1}</td>
                  <td style={styles.tableCell}>{course.courseName}</td>
                  <td style={styles.tableCell}>{course.description}</td>
                  <td style={styles.tableCell}>{course.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No courses available.</p>
      )}

      {/* Create Course Form */}
      {permissions.includes('Course.Create') && (
        <form onSubmit={addCourse} style={styles.form}>
          <h2 style={styles.subHeader}>Create Course</h2>
          <input
            style={styles.input}
            type="text"
            placeholder="Course Name"
            value={newCourse.courseName}
            onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
            required
          />
          <textarea
            style={styles.textarea}
            placeholder="Description"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Duration (e.g., 10 weeks)"
            value={newCourse.duration}
            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Category"
            value={newCourse.category}
            onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
            required
          />
          <label>
            <input
              type="checkbox"
              checked={newCourse.isPublished}
              onChange={(e) => setNewCourse({ ...newCourse, isPublished: e.target.checked })}
            />
            Publish Course
          </label>
          <button type="submit" style={{ ...styles.button, backgroundColor: '#28a745' }}>
            Create Course
          </button>
        </form>
      )}

      
      {permissions.includes('Course.Update') && <form onSubmit={updateCourse} style={styles.form}>
        <h2 style={styles.subHeader}>Update Course</h2>
        <select
          style={styles.input}
          value={updateCourseData.courseId}
          onChange={(e) => {
            const selectedCourseId = e.target.value;
            const selectedCourse = courses.find(
              (course) => course.courseId === parseInt(selectedCourseId)
            );
            setUpdateCourseData(
              selectedCourse
                ? {
                  courseId: selectedCourse.courseId,
                  courseName: selectedCourse.courseName,
                  description: selectedCourse.description,
                  duration: selectedCourse.duration,
                  category: selectedCourse.category,
                  isPublished: selectedCourse.isPublished,
                }
                : { ...updateCourseData, courseId: selectedCourseId }
            );
          }}
        >
          <option value="">Select Course to Update</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.courseName}
            </option>
          ))}
        </select>
        <input
          style={styles.input}
          type="text"
          placeholder="Updated Course Name"
          value={updateCourseData.courseName}
          onChange={(e) =>
            setUpdateCourseData({ ...updateCourseData, courseName: e.target.value })
          }
          required
        />
        <textarea
          style={styles.textarea}
          placeholder="Updated Description"
          value={updateCourseData.description}
          onChange={(e) =>
            setUpdateCourseData({ ...updateCourseData, description: e.target.value })
          }
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Updated Duration"
          value={updateCourseData.duration}
          onChange={(e) =>
            setUpdateCourseData({ ...updateCourseData, duration: e.target.value })
          }
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Updated Category"
          value={updateCourseData.category}
          onChange={(e) =>
            setUpdateCourseData({ ...updateCourseData, category: e.target.value })
          }
          required
        />
        <label>
          <input
            type="checkbox"
            checked={updateCourseData.isPublished}
            onChange={(e) =>
              setUpdateCourseData({
                ...updateCourseData,
                isPublished: e.target.checked,
              })
            }
          />
          Publish Course
        </label>
        <button
          type="submit"
          style={{ ...styles.button, backgroundColor: '#007bff' }}
        >
          Update Course
        </button>

      </form>}

      {permissions.includes('Course.Delete') && <form onSubmit={deleteCourse} style={styles.form}>
        <h2 style={styles.subHeader}>Delete Course</h2>
        <select
          style={styles.input}
          value={deleteCourseName}
          onChange={(e) => setDeleteCourseName(e.target.value)}
        >
          <option value="">Select Course to Delete</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseName}>
              {course.courseName}
            </option>
          ))}
        </select>
        <button type="submit" style={{ ...styles.button, backgroundColor: '#dc3545' }}>
          Delete Course
        </button>

      </form>}

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

