import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEmployeeByEmail } from "../services/EmployeeService";
import { FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

function EmployeeSalary() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const email = localStorage.getItem("loggedInEmail");
        if (email) {
            fetchEmployee(email);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const fetchEmployee = async (email) => {
        try {
            const res = await getEmployeeByEmail(email);
            setEmployee(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    // Calculate components if salary exists
    const baseSalary = employee?.salary || 0;
    const basic = Math.round(baseSalary * 0.6);
    const hra = Math.round(baseSalary * 0.3);
    const bonus = Math.round(baseSalary * 0.1);

    return (
        <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "40px 0" }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card border-0 shadow-lg" 
                            style={{ borderRadius: "20px", overflow: "hidden" }}
                        >
                            <div className="bg-primary text-white p-4 text-center">
                                <FaMoneyBillWave size={40} className="mb-2 opacity-75" />
                                <h3 className="fw-bold mb-0">Salary Details</h3>
                                <p className="mb-0 opacity-75">Your monthly compensation breakdown</p>
                            </div>
                            
                            <div className="card-body p-5">
                                {baseSalary > 0 ? (
                                    <>
                                        <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                            <span className="text-muted fw-bold">Basic Salary:</span>
                                            <span className="fw-bold">₹{basic.toLocaleString()}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                            <span className="text-muted fw-bold">HRA (House Rent Allowance):</span>
                                            <span className="fw-bold">₹{hra.toLocaleString()}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4 border-bottom pb-2">
                                            <span className="text-muted fw-bold">Bonus / Allowances:</span>
                                            <span className="fw-bold">₹{bonus.toLocaleString()}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded" style={{ borderLeft: "5px solid #0d6efd" }}>
                                            <h5 className="mb-0 fw-bold text-primary">Total Salary:</h5>
                                            <h4 className="mb-0 fw-bold text-success">₹{baseSalary.toLocaleString()}</h4>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <h5 className="text-muted">Salary information is not yet updated.</h5>
                                        <p className="text-muted small">Please contact HR or your Administrator.</p>
                                    </div>
                                )}

                                <div className="text-center mt-5">
                                    <Link to="/employee-dashboard" className="btn btn-outline-secondary px-4 fw-bold rounded-pill">
                                        <FaArrowLeft className="me-2" /> Back to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeSalary;