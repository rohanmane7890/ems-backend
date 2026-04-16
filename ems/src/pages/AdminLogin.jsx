import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { motion, AnimatePresence } from "framer-motion";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secretPin, setSecretPin] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // 🔒 Back Button Lockdown: Prevent navigating away from login via browser back button
    React.useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        const handleBackButton = () => {
            window.history.pushState(null, "", window.location.href);
        };
        window.addEventListener("popstate", handleBackButton);
        return () => window.removeEventListener("popstate", handleBackButton);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);
        
        AuthService.login(email, password, secretPin)
            .then((response) => {
                const role = response.data.role;
                const id = response.data.id;

                if (role === "ADMIN") {
                    AuthService.saveUser(response.data.token, role);
                    localStorage.setItem("employeeId", id || "-1");
                    localStorage.setItem("loggedInEmail", email);
                    navigate("/admin-dashboard");
                } else {
                    setErrorMessage("Access Denied! Management privileges required.");
                    AuthService.logout();
                }
            })
            .catch((error) => {
                const message = error.response?.data?.message || "Invalid Credentials. Please try again.";
                setErrorMessage(message);
            })
            .finally(() => setIsLoading(false));
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
            {/* 🌀 Design Mesh */}
            <div className="position-absolute" style={{ top: '10%', right: '10%', width: '400px', height: '400px', background: 'rgba(59, 130, 246, 0.1)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
            <div className="position-absolute" style={{ bottom: '10%', left: '10%', width: '500px', height: '500px', background: 'rgba(79, 70, 229, 0.1)', filter: 'blur(120px)', borderRadius: '50%' }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card border-0 p-lg-5 p-4 position-relative"
                style={{
                    width: "480px",
                    borderRadius: "32px",
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(25px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.7)",
                    color: "#fff",
                    zIndex: 10
                }}
            >
                <div className="text-center mb-5">
                    <div className="mb-3">
                        <i className="ri-shield-keyhole-line" style={{ fontSize: "3.5rem", background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}></i>
                    </div>
                    <h2 className="fw-bold mb-1" style={{ fontSize: "2.4rem", letterSpacing: "-1px" }}>Management <span style={{ color: "#3b82f6" }}>Portal</span></h2>
                    <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.95rem" }}>Secure Administrator Access</p>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger text-center shadow-sm border-0 mb-4 py-2" style={{ borderRadius: "12px", background: "rgba(220, 38, 38, 0.2)", color: "#fca5a5", fontSize: "0.85rem" }}>
                        <i className="ri-error-warning-line me-2"></i> {errorMessage}
                    </div>
                )}

                <form onSubmit={handleLogin} autoComplete="off">
                    <div className="mb-4">
                        <label className="form-label ms-1 small text-uppercase fw-bold opacity-50">Admin Identity</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-white-50" style={{ borderRadius: "14px 0 0 14px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                                <i className="ri-mail-line"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control text-white border-start-0 shadow-none py-3"
                                style={{ 
                                    borderRadius: "0 14px 14px 0", 
                                    border: "1px solid rgba(255, 255, 255, 0.1)", 
                                    background: "rgba(255, 255, 255, 0.05)", 
                                    fontSize: "1rem"
                                }}
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={(e) => e.target.removeAttribute('readOnly')}
                                readOnly
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label ms-1 small text-uppercase fw-bold opacity-50">Secure Phrase</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-white-50" style={{ borderRadius: "14px 0 0 14px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                                <i className="ri-lock-2-line"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control text-white border-start-0 shadow-none py-3"
                                style={{ 
                                    borderRadius: "0 14px 14px 0", 
                                    border: "1px solid rgba(255, 255, 255, 0.1)", 
                                    background: "rgba(255, 255, 255, 0.05)",
                                    fontSize: "1rem"
                                }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={(e) => e.target.removeAttribute('readOnly')}
                                readOnly
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="form-label ms-1 small text-uppercase fw-bold text-info" style={{ letterSpacing: "1px" }}>Secondary Master Key (PIN)</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-info" style={{ borderRadius: "14px 0 0 14px", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                                <i className="ri-shield-user-fill"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control text-white border-start-0 shadow-none py-3"
                                style={{ 
                                    borderRadius: "0 14px 14px 0", 
                                    border: "1px solid rgba(59, 130, 246, 0.3)", 
                                    background: "rgba(255, 255, 255, 0.05)",
                                    letterSpacing: "6px", 
                                    fontWeight: "bold",
                                    fontSize: "1rem"
                                }}
                                placeholder="••••••"
                                maxLength="6"
                                value={secretPin}
                                onChange={(e) => setSecretPin(e.target.value)}
                                onFocus={(e) => e.target.removeAttribute('readOnly')}
                                readOnly
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-admin w-100 py-3 rounded-4 text-white fw-bold d-flex justify-content-center align-items-center shadow-lg" disabled={isLoading}>
                        {isLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Sign in to Management Hub"}
                    </button>
                </form>
            </motion.div>

            <style>{`
                .btn-admin {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
                    border: none;
                    transition: all 0.3s ease;
                }
                .btn-admin:hover { transform: translateY(-3px); box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.5); }
            `}</style>
        </div>
    );
}

export default AdminLogin;
