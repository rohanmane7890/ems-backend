import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/AuthService";

function EmployeeLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 🔄 Password Reset States
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [resetEmail, setResetEmail] = useState("");
    const [resetOtp, setResetOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");
    
    // 🔐 PIN Modal States
    const [showPinModal, setShowPinModal] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [pinError, setPinError] = useState("");

    const navigate = useNavigate();

    const handleAdminAccess = () => {
        setPinInput("");
        setPinError("");
        setShowPinModal(true);
    };

    // 🔐 Password Reset Handlers
    const handleForgotRequest = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError("");
        try {
            const trimmedEmail = resetEmail.trim().toLowerCase();
            await AuthService.forgotPassword(trimmedEmail);
            setResetEmail(trimmedEmail); // 🔄 Sync state for next steps
            setResetStep(2);
        } catch (error) {
            setResetError(error.response?.data || "Email not found.");
        } finally {
            setResetLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError("");
        try {
            await AuthService.verifyResetOtp(resetEmail, resetOtp);
            setResetStep(3);
        } catch (error) {
            setResetError(error.response?.data || "Invalid or expired OTP!");
        } finally {
            setResetLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError("");
        try {
            await AuthService.resetPassword(resetEmail, resetOtp, newPassword);
            setResetSuccess("Password updated successfully! You can now login.");
            setTimeout(() => {
                setShowResetModal(false);
                setResetStep(1);
                setResetSuccess("");
                setResetEmail("");
                setResetOtp("");
                setNewPassword("");
            }, 3000);
        } catch (error) {
            setResetError(error.response?.data || "Invalid OTP or request.");
        } finally {
            setResetLoading(false);
        }
    };

    const verifyPin = (e) => {
        e.preventDefault();
        setPinError("");
        AuthService.verifyMasterPin(pinInput)
            .then(() => {
                setShowPinModal(false);
                setPinInput("");
                navigate("/admin-login");
            })
            .catch(() => {
                setPinError("❌ Security Alert: Invalid PIN! Access Denied.");
                setPinInput("");
            });
    };

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
                const message = error.response?.data?.message || error.response?.data || "Invalid Email or Password. Please try again.";
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
                background: "radial-gradient(circle at top left, #1e1b4b 0%, #0f172a 100%)",
                padding: "2rem",
                fontFamily: "'Poppins', sans-serif"
            }}
        >
            {/* 🌀 Professional Mesh Accents */}
            <div className="position-absolute" style={{ top: '5%', left: '10%', width: '400px', height: '400px', background: 'rgba(67, 56, 202, 0.2)', filter: 'blur(100px)', borderRadius: '50%', animation: 'float 20s infinite alternate' }}></div>
            <div className="position-absolute" style={{ bottom: '5%', right: '10%', width: '500px', height: '500px', background: 'rgba(126, 34, 206, 0.15)', filter: 'blur(120px)', borderRadius: '50%', animation: 'float 25s infinite alternate-reverse' }}></div>

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
                        <i className="ri-user-heart-line" style={{ fontSize: "4rem", background: "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}></i>
                    </div>
                    <h2 className="fw-bold mb-2" style={{ letterSpacing: "-0.5px", fontSize: "2.2rem" }}>Pulse EMS</h2>
                    <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.95rem" }}>Secure Employee Portal Access</p>
                </div>

                {errorMessage && (
                    <div className="alert alert-warning text-center shadow-sm border-0 mb-4" 
                         style={{ 
                             borderRadius: "12px", 
                             background: "rgba(245, 158, 11, 0.2)", 
                             color: "#fcd34d",
                             fontSize: "0.85rem"
                         }}>
                        <i className="ri-error-warning-line me-2"></i> {errorMessage}
                    </div>
                )}

                <form onSubmit={handleLogin} autoComplete="off">
                    <div className="mb-4">
                        <label className="form-label ms-1 small text-uppercase fw-semibold" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Work Email</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-white-50" style={{ borderRadius: "12px 0 0 12px", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                                <i className="ri-at-line"></i>
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
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="form-label ms-1 small text-uppercase fw-semibold" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-white-50" style={{ borderRadius: "12px 0 0 12px", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                                <i className="ri-key-2-line"></i>
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
                     <div className="mb-4 d-flex justify-content-end">
                        <span 
                            onClick={() => setShowResetModal(true)} 
                            className="text-decoration-none small fw-medium" 
                            style={{ color: "rgba(255, 255, 255, 0.4)", cursor: "pointer" }}
                        >
                            Forgot Password?
                        </span>
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
                        {isLoading ? "Verifying..." : "Sign in to Dashboard"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.85rem" }}>
                        New employee? <Link to="/register" className="text-decoration-none fw-bold" style={{ color: "#14b8a6" }}>Register here</Link>
                    </p>
                    <hr style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", margin: "1.5rem 0" }} />
                    <span 
                        onClick={handleAdminAccess} 
                        className="text-decoration-none small fw-medium" 
                        style={{ color: "rgba(255, 255, 255, 0.3)", cursor: "pointer", transition: "0.3s" }}
                        onMouseOver={(e) => e.target.style.color = "rgba(255, 255, 255, 0.7)"}
                        onMouseOut={(e) => e.target.style.color = "rgba(255, 255, 255, 0.3)"}
                    >
                        <i className="ri-admin-line me-1"></i> Are you an Administrator?
                    </span>
                 </div>
            </div>

            {/* 🔐 Professional PIN Modal Overlay */}
            {showPinModal && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ 
                        background: "rgba(0, 0, 0, 0.8)", 
                        backdropFilter: "blur(15px)", 
                        zIndex: 1050
                    }}
                >
                    <div 
                        className="card p-5 border-0 shadow-lg"
                        style={{ 
                            width: "440px", 
                            borderRadius: "32px", 
                            background: "rgba(15, 23, 42, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            color: "#fff",
                            fontFamily: "'Poppins', sans-serif",
                            boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.8)"
                        }}
                    >
                        <div className="text-center mb-4">
                            <div className="mb-3">
                                <i className="ri-shield-keyhole-line" style={{ fontSize: "4rem", background: "linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}></i>
                            </div>
                            <h3 className="fw-bold mb-2">Security Hub</h3>
                            <p className="text-white-50 small">Restricted Management: Enter Master PIN</p>
                        </div>
                        
                        {pinError && (
                            <div className="alert alert-danger py-2 small text-center mb-4" 
                                 style={{ borderRadius: "12px", background: "rgba(220, 38, 38, 0.2)", color: "#fca5a5", border: "none" }}>
                                <i className="ri-error-warning-line me-2"></i>{pinError}
                            </div>
                        )}

                        <form onSubmit={verifyPin}>
                            <div className="mb-4 text-center">
                                <input
                                    type="password"
                                    className="form-control bg-transparent text-white text-center fw-bold placeholder-light shadow-none"
                                    style={{ 
                                        borderRadius: "18px", 
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        background: "rgba(255, 255, 255, 0.03)",
                                        padding: "18px",
                                        fontSize: "1.8rem",
                                        letterSpacing: "12px"
                                    }}
                                    autoFocus
                                    placeholder="••••••"
                                    maxLength="6"
                                    value={pinInput}
                                    onChange={(e) => setPinInput(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="d-flex gap-3">
                                <button 
                                    type="button" 
                                    className="btn btn-outline-light w-50 py-3 rounded-4 fw-semibold opacity-50"
                                    style={{ transition: "0.3s", border: "1px solid rgba(255, 255, 255, 0.2)" }}
                                    onClick={() => { setShowPinModal(false); setPinInput(""); setPinError(""); }}
                                    onMouseOver={(e) => e.target.style.opacity = "1"}
                                    onMouseOut={(e) => e.target.style.opacity = "0.5"}
                                >
                                    Dismiss
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn w-50 py-3 rounded-4 fw-bold btn-primary-gradient"
                                >
                                    Verify Hub
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* 🔄 Password Reset Modal Overlay */}
            {showResetModal && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ 
                        background: "rgba(0, 0, 0, 0.85)", 
                        backdropFilter: "blur(15px)", 
                        zIndex: 1100
                    }}
                >
                    <div 
                        className="card p-5 border-0 shadow-lg"
                        style={{ 
                            width: "460px", 
                            borderRadius: "32px", 
                            background: "rgba(15, 23, 42, 0.98)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            color: "#fff",
                        }}
                    >
                        <div className="text-center mb-4">
                            <div className="mb-3">
                                <i className="ri-lock-password-line" style={{ fontSize: "3.5rem", background: "linear-gradient(135deg, #f472b6 0%, #fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}></i>
                            </div>
                            <h3 className="fw-bold mb-1">Reset Password</h3>
                            <p className="text-white-50 small">Take control of your account security</p>
                        </div>

                        {resetError && <div className="alert alert-danger py-2 small text-center mb-4">{resetError}</div>}
                        {resetSuccess && <div className="alert alert-success py-2 small text-center mb-4">{resetSuccess}</div>}

                        {resetStep === 1 && (
                            <form onSubmit={handleForgotRequest}>
                                <div className="mb-4">
                                    <label className="form-label small text-white-50">Work Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control bg-transparent text-white p-3 rounded-4" 
                                        style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
                                        placeholder="Enter your email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary-gradient w-100 py-3 rounded-4 fw-bold" disabled={resetLoading}>
                                    {resetLoading ? "Sending OTP..." : "Send Verification Code"}
                                </button>
                                <div className="text-center mt-3">
                                    <span className="small text-white-25 cursor-pointer" onClick={() => setShowResetModal(false)}>Back to Login</span>
                                </div>
                            </form>
                        )}

                        {resetStep === 2 && (
                            <form onSubmit={handleVerifyOtp}>
                                <div className="mb-4">
                                    <label className="form-label small text-white-50 text-center d-block">Check your email for the 6-digit code</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-transparent text-white text-center p-3 rounded-4 fw-bold fs-4" 
                                        style={{ border: "1px solid rgba(255, 255, 255, 0.1)", letterSpacing: "8px" }}
                                        maxLength="6"
                                        placeholder="000000"
                                        value={resetOtp}
                                        onChange={(e) => setResetOtp(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary-gradient w-100 py-3 rounded-4 fw-bold" disabled={resetLoading}>
                                    {resetLoading ? "Verifying..." : "Verify Code"}
                                </button>
                            </form>
                        )}

                        {resetStep === 3 && (
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-4">
                                    <label className="form-label small text-white-50">New Secure Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control bg-transparent text-white p-3 rounded-4" 
                                        style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary-gradient w-100 py-3 rounded-4 fw-bold" disabled={resetLoading}>
                                    {resetLoading ? "Updating..." : "Set New Password"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeLogin;
