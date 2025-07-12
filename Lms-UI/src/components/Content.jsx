import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Content({ token, handleLogout }) {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [coursePresents, setCoursePresents] = useState([]);
  const [permissions, setPermissions] = useState([]); // Stores permissions from API
  const [newContent, setNewContent] = useState({
    coursePresentId: '',
    contentType: '',
    contentURL: '',
    description: '',
  });

  const [updateContentData, setUpdateContentData] = useState({
    Contentid: '',
    coursePresentId: '',
    contentType: '',
    contentURL: '',
    description: '',
  });

  const [deleteContentName, setDeleteContentName] = useState('');

  // Fetch permissions for the current user
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7174/api/Permissions/4`,
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

  // Fetch content from the server
  const fetchContents = async (coursePresentId) => {
    try {
      const response = await axios.get(`https://localhost:7174/api/Content/view/${coursePresentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setContent(response.data);
    } catch (err) {
      console.error('Error fetching content:', err);
    }
  };

  // Add a new content
  const addContent = async (e) => {
    e.preventDefault();
    try {
      if (permissions.includes('Content.Create')) {
        await axios.post(
          'https://localhost:7174/api/Content/create',
          newContent,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        //console.log(response.data);
        alert('Content created successfully!');
        setNewContent({
          coursePresentId: '',
          contentType: '',
          contentURL: '',
          description: '',
        });
        fetchContents(); // Refresh content
      } else {
        alert('You do not have permission to create a course.');
      }
    } catch (err) {
      console.error('Error creating content:', err);
    }
  };

  // Update an existing course
  const updateContent = async (e) => {
    e.preventDefault();
    try {
      console.log('Update Data:', updateContentData);
      if (permissions.includes('Content.Update')) {
        await axios.put(
          `https://localhost:7174/api/Content/update/${updateContentData.coursePresentId}`
          ,
          updateContentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Content updated successfully!');
        setUpdateContentData({
          contentId: '',
          coursePresentId: '',
          contentType: '',
          contentURL: '',
          description: '',
        });
        // Refresh content list
        fetchContents();
      } else {
        alert('You do not have permission to update content.');
      }
    } catch (err) {
      console.error('Error updating content:', err);
      alert('Failed to update content. Please check the console for more details.');
    }
  };


  // Delete a course
  const deleteContent = async (e) => {
    e.preventDefault();
    try {
      console.log(deleteContentName);
      if (permissions.includes('Content.Delete')) {

        await axios.delete(`https://localhost:7174/api/Content/delete/${deleteContentName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Content deleted successfully!');
        setDeleteContentName('');
        fetchContents(); // Refresh courses
      } else {
        alert('You do not have permission to delete a content.');
      }
    } catch (err) {
      console.error('Error deleting Content:', err);
    }
  };
  useEffect(() => {
    fetchCoursePresents();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Content Management</h1>

      {/* Fetch Content Button */}
      <input
        type="text"
        placeholder="Enter Course PresentId"
        value={newContent.coursePresentId}
        onChange={(e) =>
          setNewContent({ ...newContent, coursePresentId: e.target.value })
        }
      />
      <button
        onClick={() => fetchContents(newContent.coursePresentId)}
        style={{ ...styles.button, backgroundColor: '#007bff' }}
      >
        View Content
      </button>

      {/* Content List */}
      {content.length > 0 ? (
        <div style={styles.contentList}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Row</th>
                <th style={styles.tableHeader}>Content Type</th>
                <th style={styles.tableHeader}>Content URL</th>
                <th style={styles.tableHeader}>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {content.map((item, index) => (
                <tr key={item.contentId}>
                  <td style={styles.tableCell}>{index + 1}</td>
                  <td style={styles.tableCell}>{item.contentType}</td>
                  <td style={styles.tableCell}>
                    <a
                      href={item.contentURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.contentURL}
                    </a>
                  </td>
                  <td style={styles.tableCell}>
                    {new Date(item.createdDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No content available.</p>
      )}

      {/* Create Content Form */}
      {permissions.includes('Content.Create') && (
        <form onSubmit={addContent} style={styles.form}>
          <h2 style={styles.subHeader}>Create Content</h2>
          <select
            style={styles.input}
            value={newContent.coursePresentId}
            onChange={(e) =>
              setNewContent({ ...newContent, coursePresentId: e.target.value })
            }
          >
            <option value="">Select Course</option>
            {coursePresents.map((course) => (
              <option key={course.coursePresentId} value={course.coursePresentId}>
                {course.course?.courseName} {/* Assuming courseName is the name of the course */}
              </option>
            ))}
          </select>

          <input
            style={styles.input}
            type="text"
            placeholder="Content Type"
            value={newContent.contentType}
            onChange={(e) => setNewContent({ ...newContent, contentType: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Content URL"
            value={newContent.contentURL}
            onChange={(e) => setNewContent({ ...newContent, contentURL: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Description"
            value={newContent.description}
            onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
          />
          <button
            type="submit"
            style={{ ...styles.button, backgroundColor: '#28a745' }}
          >
            Create Content
          </button>
        </form>
      )}

      {/* Update Content Form */}
      {permissions.includes('Content.Update') && (
        <form onSubmit={updateContent} style={styles.form}>
          <h2 style={styles.subHeader}>Update Content</h2>
          <select
            style={styles.input}
            value={updateContentData.Contentid}
            onChange={(e) => {
              const selectedContentId = e.target.value;
              const selectedContent = content.find(
                (item) => item.contentId === parseInt(selectedContentId)
              );
              setUpdateContentData(
                selectedContent
                  ? {
                    Contentid: selectedContent.contentId,
                    coursePresentId: selectedContent.coursePresentId || "", // Ensure it is set
                    contentType: selectedContent.contentType || "",
                    contentURL: selectedContent.contentURL || "",
                    description: selectedContent.description || "",
                  }
                  : { ...updateContentData, Contentid: selectedContentId }
              );
            }}
          >
            <option value="">Select Content to Update</option>
            {content.map((item) => (
              <option key={item.contentId} value={item.contentId}>
                {item.contentType}
              </option>
            ))}
          </select>
          <input
            style={styles.input}
            type="text"
            placeholder="Updated Content Type"
            value={updateContentData.contentType}
            onChange={(e) =>
              setUpdateContentData({ ...updateContentData, contentType: e.target.value })
            }
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Updated Content URL"
            value={updateContentData.contentURL}
            onChange={(e) =>
              setUpdateContentData({ ...updateContentData, contentURL: e.target.value })
            }
            required
          />
          <textarea
            style={styles.input}
            placeholder="Updated Description"
            value={updateContentData.description}
            onChange={(e) =>
              setUpdateContentData({ ...updateContentData, description: e.target.value })
            }
          />
          <button type="submit" style={{ ...styles.button, backgroundColor: '#007bff' }}>
            Update Content
          </button>
        </form>
      )}

      {/* Delete Content Form */}
      {permissions.includes('Content.Delete') && (
        <form onSubmit={deleteContent} style={styles.form}>
          <h2 style={styles.subHeader}>Delete Content</h2>
          <select
            style={styles.input}
            value={deleteContentName}
            onChange={(e) => setDeleteContentName(e.target.value)}
          >
            <option value="">Select Content to Delete</option>
            {content.map((item) => (
              <option key={item.contentId} value={item.contentId}>
                {item.contentType}
              </option>
            ))}
          </select>
          <button type="submit" style={{ ...styles.button, backgroundColor: '#dc3545' }}>
            Delete Content
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

