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
        profilePhoto: ""
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 🛡️ Registration Guard: Redirect if already authenticated
    React.useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (token && role === "EMPLOYEE") {
            navigate("/employee-dashboard", { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
      
    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        const normalizedData = { ...formData, email: formData.email.trim().toLowerCase() };
        AuthService.register(normalizedData)
            .then((response) => {
                setMessage({ text: "Registration almost complete! 📧 Check your email for a verification code.", type: "success" });
                setIsOtpSent(true);
            })
            .catch((error) => {
                setMessage({ 
                    text: error.response?.data?.message || "Registration failed.", 
                    type: "danger" 
                });
            })
            .finally(() => setLoading(false));
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        AuthService.verifyRegistration(formData.email, otp)
            .then((response) => {
                const { token, role, id, message } = response.data;
                
                // ✅ Auto-Login: Save credentials
                AuthService.saveUser(token, role);
                localStorage.setItem("employeeId", id);
                localStorage.setItem("loggedInEmail", formData.email);

                setMessage({ text: "✅ " + message, type: "success" });
                
                // Redirect immediately based on role
                setTimeout(() => {
                    if (role === "ADMIN") navigate("/admin-dashboard");
                    else navigate("/employee-dashboard");
                }, 1500);
            })
            .catch((error) => {
                setMessage({ 
                    text: error.response?.data || "Verification failed. Check your code.", 
                    type: "danger" 
                });
            })
            .finally(() => setLoading(false));
    };

    const handleChangeEmail = () => {
        setLoading(true);
        AuthService.rollbackRegistration(formData.email)
            .then(() => {
                setIsOtpSent(false);
                setOtp("");
                setMessage({ text: "Please enter your correct email address.", type: "info" });
            })
            .catch(() => {
                // If it fails (e.g. record manually deleted), just go back anyway
                setIsOtpSent(false);
            })
            .finally(() => setLoading(false));
    };

    const designationsByDept = {
        "IT": ["Software Engineer", "Lead Developer", "System Architect", "QA Engineer", "DevOps Engineer", "UI/UX Designer"],
        "HR": ["HR Manager", "Recruiter", "HR Specialist", "Talent Acquisition"],
        "Finance": ["Accountant", "Financial Analyst", "Finance Manager", "Auditor"],
        "Marketing": ["Marketing Specialist", "Content Strategist", "Social Media Manager", "SEO Specialist"],
        "Operations": ["Operations Manager", "Logistics Coordinator", "Project Manager"],
        "Sales": ["Sales Executive", "Account Manager", "Business Development", "Sales Lead"]
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center overflow-hidden position-relative"
            style={{
                minHeight: "100vh",
                background: "radial-gradient(circle at bottom left, #1e1b4b 0%, #0f172a 100%)",
                padding: "2rem",
                fontFamily: "'Poppins', sans-serif"
            }}
        >
            {/* 🌀 Professional Mesh Accents */}
            <div className="position-absolute" style={{ top: '5%', right: '5%', width: '400px', height: '400px', background: 'rgba(79, 70, 229, 0.15)', filter: 'blur(100px)', borderRadius: '50%', animation: 'float 20s infinite alternate' }}></div>
            <div className="position-absolute" style={{ bottom: '10%', left: '10%', width: '500px', height: '500px', background: 'rgba(124, 58, 237, 0.12)', filter: 'blur(120px)', borderRadius: '50%', animation: 'float 25s infinite alternate-reverse' }}></div>
            <div
                className="card border-0 p-5 position-relative"
                style={{
                    width: "600px",
                    borderRadius: "32px",
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(25px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.6)",
                    color: "#fff",
                    animation: "slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)"
                }}
            >
                <div className="text-center mb-5">
                    <div className="mb-3">
                        <i className="ri-user-add-line" style={{ fontSize: "3.5rem", background: "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}></i>
                    </div>
                    <h2 className="fw-bold mb-1" style={{ letterSpacing: "-0.5px" }}>Create Account</h2>
                    <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.9rem" }}>Join the excellence at NexGen Workforce</p>
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

                {!isOtpSent ? (
                    <form onSubmit={handleRegister}>
                        {/* --- Personal Information Section --- */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>First Name <span className="text-danger">*</span></label>
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
                                <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Last Name <span className="text-danger">*</span></label>
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

                        {/* --- Work Information Section (Highlighted) --- */}
                        <div className="p-3 mb-3 rounded-4" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                            <p className="small text-uppercase fw-bold mb-3" style={{ color: "#818cf8", letterSpacing: "1px" }}>
                                <i className="ri-briefcase-line me-2"></i>Work Information
                            </p>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                                        <i className="ri-building-line me-1"></i> Department <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select bg-transparent text-white"
                                        style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px", appearance: "none" }}
                                        name="department"
                                        value={formData.department}
                                        onChange={(e) => {
                                            setFormData({ ...formData, department: e.target.value, designation: "" });
                                        }}
                                        required
                                    >
                                        <option value="" disabled style={{ background: "#1e1b4b" }}>Select Department</option>
                                        {Object.keys(designationsByDept).map(dept => (
                                            <option key={dept} value={dept} style={{ background: "#1e1b4b" }}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small text-uppercase fw-semibold ps-1" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                                        <i className="ri-award-line me-1"></i> Designation <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select bg-transparent text-white"
                                        style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px", appearance: "none" }}
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        required
                                        disabled={!formData.department}
                                    >
                                        <option value="" disabled style={{ background: "#1e1b4b" }}>
                                            {!formData.department ? "Select Dept First" : "Select Role"}
                                        </option>
                                        {formData.department && designationsByDept[formData.department].map(role => (
                                            <option key={role} value={role} style={{ background: "#1e1b4b" }}>{role}</option>
                                        ))}
                                    </select>
                                </div>
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
                                autoComplete="off"
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
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn w-100 py-3 rounded-4 text-white fw-bold mb-4 btn-primary-gradient"
                        >
                            Register Member
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="text-center mb-4">
                            <p className="small" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                                Please enter the 6-digit verification code sent to <strong>{formData.email}</strong>
                            </p>
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                className="form-control bg-transparent text-white text-center fs-3 fw-bold"
                                style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "12px", letterSpacing: "8px" }}
                                maxLength="6"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn w-100 py-3 rounded-3 text-white fw-bold mb-4"
                            style={{ 
                                background: "linear-gradient(45deg, #10b981 0%, #059669 100%)", 
                                border: "none",
                                boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.4)"
                            }}
                        >
                            Verify & Activate
                        </button>
                        <div className="text-center">
                            <button 
                                type="button" 
                                className="btn btn-link text-white-50 small p-0 text-decoration-none hover-white" 
                                onClick={handleChangeEmail}
                                disabled={loading}
                            >
                                <i className="ri-arrow-left-line me-1"></i> Change Email
                            </button>
                        </div>
                    </form>
                )}

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
