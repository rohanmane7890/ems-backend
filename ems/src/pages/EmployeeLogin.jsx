import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

function EmployeeLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setErrorMessage("");

        AuthService.login(email, password)
            .then((response) => {

                const role = response.data.role;
                const id = response.data.id;   

                AuthService.saveUser(response.data.token, role);

                // 
                localStorage.setItem("employeeId", id);
                localStorage.setItem("loggedInEmail",email)

                if (role === "EMPLOYEE") {
                    navigate("/employee-dashboard");
                } else {
                    setErrorMessage("Access Denied! Not an Employee.");
                }
            })
            .catch(() => {
                setErrorMessage("Invalid Email or Password");
            });
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
            }}
        >
            <div
                className="card shadow-lg border-0 p-4"
                style={{ width: "400px", borderRadius: "20px" }}
            >
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Employee Login</h2>
                    <p className="text-muted">Access Your Dashboard</p>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger text-center">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="employeeEmail"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="employeeEmail">Email address</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="employeePassword"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="employeePassword">Password</label>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2">
                        Login
                    </button>

                </form>

                <div className="text-center mt-3">
                    <small className="text-light">
                        © 2026 Employee Management System
                    </small>
                </div>
            </div>
        </div>
    );
}

export default EmployeeLogin;
