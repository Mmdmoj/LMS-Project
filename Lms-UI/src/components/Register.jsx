import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = ({ setToken }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        userName: "",
        password: "",
        role: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate(); // To handle redirection after registration

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post(
                "https://localhost:7174/api/auth/register",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // On success, get the token from the response and set it using setToken
            const token = response.data.token; // assuming the token is returned in this way
            setToken(token);

            // Store token in localStorage
            localStorage.setItem("token", token);

            setSuccess("Registration successful!");
            setFormData({
                name: "",
                email: "",
                userName: "",
                password: "",
                role: "",
            });

            // Redirect to login page after successful registration
            setTimeout(() => navigate("/login"), 500); // Redirect after 1.5 seconds
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Registration failed");
            } else {
                setError(err.message);
            }
        }
    };

    // Styles object (unchanged)
    const styles = {
        container: {
            maxWidth: "400px",
            margin: "50px auto",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
        },
        title: {
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
        },
        formGroup: {
            marginBottom: "15px",
        },
        label: {
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "5px",
        },
        input: {
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
        },
        select: {
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            backgroundColor: "#fff",
        },
        button: {
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
        buttonHover: {
            backgroundColor: "#0056b3",
        },
        error: {
            color: "red",
            fontSize: "14px",
            textAlign: "center",
            marginTop: "10px",
        },
        success: {
            color: "green",
            fontSize: "14px",
            textAlign: "center",
            marginTop: "10px",
        },
        link: {
            textAlign: "center",
            marginTop: "10px",
            fontSize: "14px",
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Register</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.label}>
                        Full Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="userName" style={styles.label}>
                        Username:
                    </label>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="role" style={styles.label}>
                        Role:
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        style={styles.select}
                    >
                        <option value="" disabled>
                            Select your role
                        </option>
                        <option value="Student">Student</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Administrator">Administrator</option>
                    </select>
                </div>
                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}
                <button
                    type="submit"
                    style={styles.button}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                >
                    Register
                </button>
            </form>
            <div style={styles.link}>
                <p>
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}>
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
