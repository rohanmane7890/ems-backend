import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        AuthService.login(email, password)
            .then(response => {

                const role = response.data.role;

                AuthService.saveUser("dummy-token", role);

                if (role === "ADMIN") {
                    navigate("/admin-dashboard");
                } else {
                    alert("Not an Admin");
                }
            })
            .catch(() => {
                alert("Invalid Credentials");
            });
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #141E30, #243B55)"
            }}
        >
            <div className="card shadow-lg p-4 border-0"
                style={{ width: "400px", borderRadius: "20px" }}>

                <div className="text-center mb-4">
                    <h2 className="fw-bold">Admin Login</h2>
                    <p className="text-muted">Access Admin Dashboard</p>
                </div>

                <form onSubmit={handleLogin}>

                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="email">Email address</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    <button className="btn btn-dark w-100 py-2">
                        Login
                    </button>

                </form>

                <div className="text-center mt-3">
                    <small className="text-muted">
                        © 2026 Employee Management System
                    </small>
                </div>

            </div>
        </div>
    );
}

export default AdminLogin;
