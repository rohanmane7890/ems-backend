import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/AuthService";

function AdminLogin() {
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

                if (role === "ADMIN") {
                    AuthService.saveUser(response.data.token, role);
                    localStorage.setItem("employeeId", id || "-1");
                    localStorage.setItem("loggedInEmail", email);
                    navigate("/admin-dashboard");
                } else {
                    setErrorMessage("Access Denied! You do not have Administrator privileges.");
                    AuthService.logout();
                }
            })
            .catch((error) => {
                const message = error.response?.data?.message || error.response?.data || "Invalid Credentials. Please try again.";
                setErrorMessage(message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center overflow-hidden position-relative"
            style={{
                minHeight: "100vh",
                background: "radial-gradient(circle at bottom right, #0f172a 0%, #1e1b4b 100%)",
                padding: "2rem",
                fontFamily: "'Poppins', sans-serif"
            }}
        >
            {/* 🌀 Professional Mesh Accents */}
            <div className="position-absolute" style={{ top: '10%', right: '10%', width: '400px', height: '400px', background: 'rgba(30, 64, 175, 0.2)', filter: 'blur(100px)', borderRadius: '50%', animation: 'float 20s infinite alternate' }}></div>
            <div className="position-absolute" style={{ bottom: '10%', left: '10%', width: '500px', height: '500px', background: 'rgba(79, 70, 229, 0.15)', filter: 'blur(120px)', borderRadius: '50%', animation: 'float 25s infinite alternate-reverse' }}></div>

            <div
                className="card border-0 p-5 position-relative"
                style={{
                    width: "460px",
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
                        <i className="ri-shield-user-line" style={{ fontSize: "4rem", background: "linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}></i>
                    </div>
                    <h2 className="fw-bold mb-2" style={{ letterSpacing: "-0.5px", fontSize: "2.2rem" }}>Admin Portal</h2>
                    <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.95rem" }}>System Management Control</p>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger text-center shadow-sm border-0 mb-4" 
                         style={{ 
                             borderRadius: "12px", 
                             background: "rgba(220, 38, 38, 0.2)", 
                             color: "#fca5a5",
                             fontSize: "0.85rem"
                         }}>
                        <i className="ri-error-warning-line me-2"></i> {errorMessage}
                    </div>
                )}

                <form onSubmit={handleLogin} autoComplete="off">
                    <div className="mb-4">
                        <label className="form-label ms-1 small text-uppercase fw-semibold" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Admin Email</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-white-50" style={{ borderRadius: "14px 0 0 14px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                                <i className="ri-mail-seal-line"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control bg-transparent text-white border-start-0 shadow-none"
                                style={{ 
                                    borderRadius: "0 14px 14px 0", 
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    background: "rgba(255, 255, 255, 0.03)",
                                    padding: "14px",
                                    color: "#fff"
                                }}
                                placeholder="admin@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="form-label ms-1 small text-uppercase fw-semibold" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Secure Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-white-50" style={{ borderRadius: "14px 0 0 14px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                                <i className="ri-lock-password-line"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control bg-transparent text-white border-start-0 shadow-none"
                                style={{ 
                                    borderRadius: "0 14px 14px 0", 
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    background: "rgba(255, 255, 255, 0.03)",
                                    padding: "14px",
                                    color: "#fff"
                                }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn w-100 py-3 rounded-4 text-white fw-bold mb-4 d-flex justify-content-center align-items-center btn-primary-gradient"
                        style={{ 
                            fontSize: "1.05rem",
                            letterSpacing: "0.5px"
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                        {isLoading ? "Authenticating..." : "Sign in to Management"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <Link to="/" className="text-decoration-none small fw-medium" style={{ color: "rgba(255, 255, 255, 0.3)", transition: "0.3s" }} onMouseOver={(e) => e.target.style.color = "rgba(255, 255, 255, 0.7)"} onMouseOut={(e) => e.target.style.color = "rgba(255, 255, 255, 0.3)"}>
                        <i className="ri-arrow-left-line me-1"></i> Back to Employee Portal
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
