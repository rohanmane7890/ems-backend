import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/AuthService";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        AuthService.login(email, password)
            .then((response) => {
                const role = response.data.role;
                const id = response.data.id;

                AuthService.saveUser(response.data.token, role);
                localStorage.setItem("employeeId", id || "");
                localStorage.setItem("loggedInEmail", email);

                if (role === "ADMIN") {
                    navigate("/admin-dashboard");
                } else if (role === "EMPLOYEE") {
                    navigate("/employee-dashboard");
                } else {
                    setErrorMessage("Unknown Role Detected. Access Denied.");
                }
            })
            .catch(() => {
                setErrorMessage("Invalid Email or Password. Please try again.");
            })
            .finally(() => {
                setIsLoading(false);
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
                    width: "440px",
                    borderRadius: "24px",
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#fff"
                }}
            >
                <div className="text-center mb-5">
                    <div className="mb-3">
                        <i className="ri-shield-user-line" style={{ fontSize: "3rem", color: "#4facfe" }}></i>
                    </div>
                    <h2 className="fw-bold mb-2" style={{ letterSpacing: "1px" }}>Welcome Back</h2>
                    <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>Secure access to your dashboard</p>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger text-center shadow-sm border-0" 
                         style={{ 
                             borderRadius: "12px", 
                             background: "rgba(220, 38, 38, 0.2)", 
                             color: "#fca5a5",
                             fontSize: "0.9rem"
                         }}>
                        <i className="ri-error-warning-line me-2"></i> {errorMessage}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="form-label ms-1 small text-uppercase fw-semibold" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-white-50" style={{ borderRadius: "12px 0 0 12px", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                                <i className="ri-mail-line"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control bg-transparent text-white border-start-0"
                                style={{ 
                                    borderRadius: "0 12px 12px 0", 
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    padding: "12px"
                                }}
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="form-label ms-1 small text-uppercase fw-semibold" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-white-50" style={{ borderRadius: "12px 0 0 12px", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                                <i className="ri-lock-line"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control bg-transparent text-white border-start-0"
                                style={{ 
                                    borderRadius: "0 12px 12px 0", 
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    padding: "12px"
                                }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn w-100 py-3 rounded-3 text-white fw-bold mb-4 d-flex justify-content-center align-items-center"
                        style={{ 
                            background: "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)", 
                            border: "none",
                            transition: "all 0.3s ease",
                            boxShadow: "0 10px 20px -5px rgba(79, 172, 254, 0.4)"
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                        {isLoading ? "Validating..." : "Sign In"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem" }}>
                        New to the team? <Link to="/register" className="text-decoration-none fw-bold" style={{ color: "#4facfe" }}>Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
