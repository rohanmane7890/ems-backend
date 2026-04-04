import React from "react";
import { Link } from "react-router-dom";

function LoginSelection() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #1f1c2c, #928dab)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div className="container text-center">

                {/* Title Section */}
                <h1 className="fw-bold text-white mb-3">
                    Employee Management System
                </h1>
                <p className="text-light mb-5">
                    Manage employees, departments, and organizational records efficiently.
                </p>

                {/* Login Cards */}
                <div className="row justify-content-center">

                    {/* Admin Card */}
                    <div className="col-md-4 mb-4">
                        <div
                            className="card shadow-lg border-0 p-4"
                            style={{
                                borderRadius: "20px",
                                transition: "0.3s",
                                cursor: "pointer",
                            }}
                        >
                            <h3 className="mb-3">👨‍💼 Admin</h3>
                            <p className="text-muted">
                                Manage employees, view reports, and control system settings.
                            </p>
                            <Link to="/admin-login">
                                <button className="btn btn-dark w-100 mt-3">
                                    Admin Login 
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Employee Card */}
                    <div className="col-md-4 mb-4">
                        <div
                            className="card shadow-lg border-0 p-4"
                            style={{
                                borderRadius: "20px",
                                transition: "0.3s",
                                cursor: "pointer",
                            }}
                        >
                            <h3 className="mb-3">👨‍💻 Employee</h3>
                            <p className="text-muted">
                                View personal details, department info, and employment status.
                            </p>
                            <Link to="/employee-login">
                                <button className="btn btn-primary w-100 mt-3">
                                    Employee Login 
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LoginSelection;
