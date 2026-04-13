import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/AuthService";
import { motion, AnimatePresence } from "framer-motion";

function EmployeeLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 🔄 Password Reset States
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetStep, setResetStep] = useState(1);
    const [resetEmail, setResetEmail] = useState("");
    const [resetOtp, setResetOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        AuthService.login(email, password)
            .then((response) => {
                const role = response.data.role;
                const id = response.data.id;

                if (role === "EMPLOYEE") {
                    AuthService.saveUser(response.data.token, role);
                    localStorage.setItem("employeeId", id || "");
                    localStorage.setItem("loggedInEmail", email);
                    navigate("/employee-dashboard");
                } else {
                    setErrorMessage("Invalid login! Please use the Admin Portal for management access.");
                    AuthService.logout();
                }
            })
            .catch((error) => {
                const message = error.response?.data?.message || "Invalid Email or Password. Please try again.";
                setErrorMessage(message);
            })
            .finally(() => setIsLoading(false));
    };

    // 🔐 Reset Handlers
    const handleForgotRequest = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError("");
        try {
            const trimmedEmail = resetEmail.trim().toLowerCase();
            await AuthService.forgotPassword(trimmedEmail);
            setResetEmail(trimmedEmail);
            setResetStep(2);
        } catch (error) { setResetError(error.response?.data || "Email not found."); }
        finally { setResetLoading(false); }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError("");
        try {
            await AuthService.verifyResetOtp(resetEmail, resetOtp);
            setResetStep(3);
        } catch (error) { setResetError("Invalid or expired OTP!"); }
        finally { setResetLoading(false); }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError("");
        try {
            await AuthService.resetPassword(resetEmail, resetOtp, newPassword);
            setResetSuccess("Password updated!");
            setTimeout(() => { setShowResetModal(false); setResetStep(1); }, 3000);
        } catch (error) { setResetError("Request failed."); }
        finally { setResetLoading(false); }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center overflow-hidden position-relative"
            style={{
                minHeight: "100vh",
                background: "#0f112e", // Deep Navy Background
                padding: "2rem",
                fontFamily: "'Poppins', sans-serif"
            }}
        >
            {/* 🌀 Background Radial Gradient Glow */}
            <div className="position-absolute w-100 h-100" style={{
                background: "radial-gradient(circle at center, #1b1e4d 0%, #0f112e 100%)",
                zIndex: 1
            }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card border-0 p-lg-5 p-4 position-relative"
                style={{
                    width: "480px",
                    borderRadius: "32px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    zIndex: 10
                }}
            >
                <div className="text-center mb-5">
                    <h1 className="fw-bold mb-1" style={{ fontSize: "2.8rem", letterSpacing: "-1px" }}>
                        NexGen <span style={{ color: "transparent", background: "linear-gradient(90deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text" }}>Workforce</span>
                    </h1>
                    <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "1rem" }}>
                        Secure Employee Portal Access
                    </p>
                </div>

                {errorMessage && (
                    <div className="alert alert-warning text-center shadow-sm border-0 mb-4 py-2" style={{ borderRadius: "12px", background: "rgba(245, 158, 11, 0.2)", color: "#fcd34d", fontSize: "0.85rem" }}>
                        <i className="ri-error-warning-line me-2"></i> {errorMessage}
                    </div>
                )}

                <form onSubmit={handleLogin} autoComplete="off">
                    <div className="mb-4">
                        <label className="form-label ms-1 small text-uppercase fw-bold opacity-50" style={{ letterSpacing: "1px" }}>Work Email</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-white-50" style={{ borderRadius: "14px 0 0 14px", border: "1px solid rgba(255, 255, 255, 0.12)" }}>
                                <i className="ri-at-line"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control text-dark border-start-0 shadow-none py-3"
                                style={{
                                    borderRadius: "0 14px 14px 0",
                                    border: "1px solid rgba(255, 255, 255, 0.12)",
                                    background: "#e8f0fe",
                                    fontSize: "1rem"
                                }}
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={(e) => e.target.removeAttribute('readOnly')}
                                readOnly
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="form-label ms-1 small text-uppercase fw-bold opacity-50" style={{ letterSpacing: "1px" }}>Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-white-50" style={{ borderRadius: "14px 0 0 14px", border: "1px solid rgba(255, 255, 255, 0.12)" }}>
                                <i className="ri-key-2-line"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control text-dark border-start-0 shadow-none py-3"
                                style={{
                                    borderRadius: "0 14px 14px 0",
                                    border: "1px solid rgba(255, 255, 255, 0.12)",
                                    background: "#e8f0fe",
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
                        <div className="text-end mt-2">
                            <span onClick={() => setShowResetModal(true)} className="small text-white-50 cursor-pointer" style={{ fontSize: "0.85rem" }}>Forgot Password?</span>
                        </div>
                    </div>

                    <button type="submit" className="btn w-100 py-3 rounded-pill text-white fw-bold mb-4 shadow-lg btn-purple-gradient" disabled={isLoading}>
                        {isLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Sign in to Dashboard"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.95rem" }}>
                        New employee? <Link to="/register" className="text-decoration-none fw-bold" style={{ color: "#14b8a6" }}>Register here</Link>
                    </p>
                </div>
            </motion.div>

            {/* 🔐 Reset Modal */}
            <AnimatePresence>
                {showResetModal && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0, 0, 0, 0.9)", backdropFilter: "blur(20px)", zIndex: 1100 }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-5 border-0" style={{ width: "460px", borderRadius: "32px", background: "#0f112e", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#fff" }}>
                            <div className="text-center mb-4">
                                <h3 className="fw-bold mb-1">Reset Password</h3>
                                <p className="text-white-50 small">Secure recovery process initiated</p>
                            </div>
                            {resetStep === 1 && (
                                <form onSubmit={handleForgotRequest}>
                                    <input type="email" className="form-control bg-transparent text-white p-3 rounded-4 mb-3" style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }} placeholder="Enter email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
                                    <button type="submit" className="btn btn-purple-gradient w-100 py-3 rounded-pill fw-bold">Send OTP</button>
                                    <div className="text-center mt-3"><span className="small text-white-50 cursor-pointer" onClick={() => setShowResetModal(false)}>Cancel</span></div>
                                </form>
                            )}
                            {resetStep === 2 && (
                                <form onSubmit={handleVerifyOtp}>
                                    <input type="text" className="form-control bg-transparent text-white text-center p-3 rounded-4 mb-3 fw-bold fs-4" style={{ border: "1px solid rgba(255, 255, 255, 0.1)", letterSpacing: "8px" }} maxLength="6" placeholder="000000" value={resetOtp} onChange={(e) => setResetOtp(e.target.value)} required />
                                    <button type="submit" className="btn btn-purple-gradient w-100 py-3 rounded-pill fw-bold">Verify OTP</button>
                                </form>
                            )}
                            {resetStep === 3 && (
                                <form onSubmit={handleResetPassword}>
                                    <input type="password" className="form-control bg-transparent text-white p-3 rounded-4 mb-3" style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                    <button type="submit" className="btn btn-purple-gradient w-100 py-3 rounded-pill fw-bold">Update Password</button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .btn-purple-gradient {
                    background: linear-gradient(to right, #7c3aed, #a855f7) !important;
                    border: none;
                    transition: all 0.3s ease;
                }
                .btn-purple-gradient:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -5px rgba(124, 58, 237, 0.5);
                }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </div>
    );
}

export default EmployeeLogin;
