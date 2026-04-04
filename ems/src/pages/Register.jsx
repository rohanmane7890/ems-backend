import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/AuthService";

function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
        department: "",
        designation: "",
        address: "",
        phoneNumber: "",
        salary: "",
        profilePhoto: ""
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
      
    const handleRegister = (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });

        AuthService.register(formData)
            .then(() => {
                setMessage({ text: "Registration successful! Redirecting to login...", type: "success" });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            })
            .catch((error) => {
                setMessage({ 
                    text: error.response?.data?.message || "Registration failed. Please check your details.", 
                    type: "danger" 
                });
            });
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
                padding: "2rem",
                fontFamily: "'Poppins', sans-serif"
            }}
        >
            <div
                className="card shadow-2xl border-0 p-5"
                style={{
                    width: "600px",
                    borderRadius: "24px",
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#fff"
                }}
            >
                <div className="text-center mb-5">
                    <div className="mb-3">
                        <i className="ri-user-add-line" style={{ fontSize: "3rem", color: "#4facfe" }}></i>
                    </div>
                    <h2 className="fw-bold mb-2">Create Account</h2>
                    <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>Join the excellence at EMS</p>
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type} text-center shadow-sm border-0`} 
                         style={{ 
                             borderRadius: "12px", 
                             background: message.type === 'success' ? "rgba(16, 185, 129, 0.2)" : "rgba(220, 38, 38, 0.2)", 
                             color: message.type === 'success' ? "#6ee7b7" : "#fca5a5",
                             fontSize: "0.9rem"
                         }}>
                        <i className={message.type === 'success' ? "ri-checkbox-circle-line me-2" : "ri-error-warning-line me-2"}></i> {message.text}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>First Name</label>
                            <input
                                type="text"
                                className="form-control bg-transparent text-white"
                                style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px" }}
                                name="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Last Name</label>
                            <input
                                type="text"
                                className="form-control bg-transparent text-white"
                                style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px" }}
                                name="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Department</label>
                            <select
                                className="form-select bg-transparent text-white"
                                style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px", appearance: "none" }}
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled style={{ background: "#24243e" }}>Select Department</option>
                                <option value="IT" style={{ background: "#24243e" }}>IT</option>
                                <option value="HR" style={{ background: "#24243e" }}>HR</option>
                                <option value="Finance" style={{ background: "#24243e" }}>Finance</option>
                                <option value="Marketing" style={{ background: "#24243e" }}>Marketing</option>
                                <option value="Operations" style={{ background: "#24243e" }}>Operations</option>
                                <option value="Sales" style={{ background: "#24243e" }}>Sales</option>

                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Designation</label>
                            <input
                                type="text"
                                className="form-control bg-transparent text-white"
                                style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px" }}
                                name="designation"
                                placeholder="Lead Developer"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Address</label>
                            <input
                                type="text"
                                className="form-control bg-transparent text-white"
                                style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px" }}
                                name="address"
                                placeholder="Enter address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Phone Number</label>
                            <input
                                type="text"
                                className="form-control bg-transparent text-white"
                                style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px" }}
                                name="phoneNumber"
                                placeholder="Enter phone number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Salary</label>
                            <input
                                type="text"
                                className="form-control bg-transparent text-white"
                                style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px" }}
                                name="salary"
                                placeholder="Enter salary"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>


                    <div className="mb-3">
                        <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Email Address</label>
                        <input
                            type="email"
                            className="form-control bg-transparent text-white"
                            style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px" }}
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Password</label>
                        <input
                            type="password"
                            className="form-control bg-transparent text-white"
                            style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px" }}
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn w-100 py-3 rounded-3 text-white fw-bold mb-4"
                        style={{ 
                            background: "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)", 
                            border: "none",
                            boxShadow: "0 10px 20px -5px rgba(79, 172, 254, 0.4)"
                        }}
                    >
                        Register Member
                    </button>
                </form>

                <div className="text-center mt-2">
                    <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem" }}>
                        Already have an account? <Link to="/login" className="text-decoration-none fw-bold" style={{ color: "#4facfe" }}>Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
