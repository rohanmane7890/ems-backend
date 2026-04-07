import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEmployeeByEmail, getSalaryHistory } from "../services/EmployeeService";
import { FaMoneyBillWave, FaArrowLeft, FaHistory, FaCheckCircle, FaReceipt } from "react-icons/fa";
import { motion } from "framer-motion";

function EmployeeSalary() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [history, setHistory] = useState([]);
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
            if (res.data.id) {
                fetchHistory(res.data.id);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const fetchHistory = async (id) => {
        try {
            const res = await getSalaryHistory(id);
            setHistory(res.data || []);
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    // Calculate components if salary exists
    const baseSalary = employee?.salary || 0;
    const basic = Math.round(baseSalary * 0.6);
    const hra = Math.round(baseSalary * 0.3);
    const bonus = Math.round(baseSalary * 0.1);

    return (
        <div style={{ 
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", 
            minHeight: "100vh", 
            padding: "30px 0",
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="container py-3">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-xl-5">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="shadow-2xl border-0 overflow-hidden" 
                            style={{ 
                                borderRadius: "20px", 
                                background: "rgba(30, 41, 59, 0.6)", 
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                            }}
                        >
                            {/* Compact Header Section */}
                            <div className="text-white p-3 text-center border-bottom border-white border-opacity-5" style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)" }}>
                                <div className="bg-primary bg-opacity-20 d-inline-flex p-2 rounded-circle mb-2 shadow-sm" style={{ border: "1px solid rgba(13, 110, 253, 0.3)" }}>
                                    <FaMoneyBillWave size={24} className="text-primary" />
                                </div>
                                <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.5px" }}>Salary Details</h4>
                                <p className="mb-0 text-white-50 small" style={{ fontSize: "0.75rem" }}>Monthly Breakdown</p>
                            </div>
                            
                            <div className="card-body p-4">
                                {baseSalary > 0 ? (
                                    <div className="salary-items">
                                        <div className="salary-pill mb-2">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="icon-box bg-info bg-opacity-10 shadow-sm border border-info border-opacity-10"><i className="ri-wallet-3-line text-info fs-5"></i></div>
                                                <div className="flex-grow-1">
                                                    <div className="text-white-50 fw-bold text-uppercase" style={{ letterSpacing: "1px", fontSize: "0.6rem" }}>Basic Salary</div>
                                                    <div className="h6 mb-0 fw-bold text-white mt-1">₹{basic.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="salary-pill mb-2">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="icon-box bg-warning bg-opacity-10 shadow-sm border border-warning border-opacity-10"><i className="ri-home-4-line text-warning fs-5"></i></div>
                                                <div className="flex-grow-1">
                                                    <div className="text-white-50 fw-bold text-uppercase" style={{ letterSpacing: "1px", fontSize: "0.6rem" }}>HRA</div>
                                                    <div className="h6 mb-0 fw-bold text-white mt-1">₹{hra.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="salary-pill mb-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="icon-box bg-purple bg-opacity-10 shadow-sm border border-purple border-opacity-10"><i className="ri-gift-line text-purple fs-5"></i></div>
                                                <div className="flex-grow-1">
                                                    <div className="text-white-50 fw-bold text-uppercase" style={{ letterSpacing: "1px", fontSize: "0.6rem" }}>Bonus / Allowances</div>
                                                    <div className="h6 mb-0 fw-bold text-white mt-1">₹{bonus.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-4 shadow-2xl border border-primary border-opacity-20 overflow-hidden position-relative animate-glow" 
                                             style={{ 
                                                 background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.02) 100%)"
                                             }}>
                                            <div className="d-flex justify-content-between align-items-center position-relative z-1">
                                                <div>
                                                    <h6 className="text-primary fw-bold text-uppercase mb-1" style={{ letterSpacing: "1.5px", fontSize: "0.6rem" }}>NET PAYOUT</h6>
                                                    <h2 className="mb-0 fw-bold text-white" style={{ fontSize: "1.25rem" }}>Monthly Take-Home</h2>
                                                </div>
                                                <div className="text-end">
                                                    <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20 px-2 py-0.5 rounded-pill mb-1 small fw-bold" style={{ fontSize: "0.55rem" }}>ACTIVE</div>
                                                    <h3 className="mb-0 fw-bold text-success" style={{ textShadow: "0 0 20px rgba(34, 197, 94, 0.3)", fontSize: "1.75rem" }}>
                                                        ₹{baseSalary.toLocaleString()}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: "rotate(-10deg) translate(25px, -15px)" }}>
                                                <FaMoneyBillWave size={100} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5">
                                        <div className="mb-2 text-white-25">
                                            <i className="ri-error-warning-line h1"></i>
                                        </div>
                                        <h6 className="text-white fw-bold">Salary Data Missing</h6>
                                        <p className="text-white-50 small mb-0 px-4" style={{ fontSize: "0.7rem" }}>Not configured by HR yet.</p>
                                    </div>
                                )}

                                <div className="text-center mt-4">
                                    <button 
                                        onClick={() => navigate("/employee-dashboard")} 
                                        className="btn btn-link text-info text-decoration-none fw-bold small px-4 py-2 hover-glow rounded-pill transition-all"
                                        style={{ letterSpacing: "1.5px", fontSize: "0.65rem" }}
                                    >
                                        <FaArrowLeft className="me-2" /> EXIT TO DASHBOARD
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Transaction History Section */}
                    <div className="col-lg-8 col-xl-7 mt-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card border-0 shadow-2xl overflow-hidden" 
                            style={{ 
                                borderRadius: "24px", 
                                background: "rgba(15, 23, 42, 0.4)", 
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                backdropFilter: "blur(20px)"
                            }}
                        >
                            <div className="card-header bg-transparent border-bottom border-white border-opacity-5 p-4 d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="text-white fw-bold mb-0">Disbursement History</h5>
                                    <p className="text-white-50 small mb-0 mt-1" style={{ fontSize: "0.7rem" }}>All past salary transactions recorded for your account.</p>
                                </div>
                                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 px-3 py-2 rounded-pill small fw-bold">
                                    {history.length} PAYOUTS
                                </span>
                            </div>
                            <div className="card-body p-4">
                                {history.length > 0 ? (
                                    <div className="transaction-list d-flex flex-column gap-3">
                                        {history.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)).map((record) => (
                                            <div key={record.id} className="transaction-item p-3 d-flex align-items-center justify-content-between transition-all rounded-4 shadow-sm"
                                                 style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="p-2 rounded bg-info bg-opacity-10 text-info">
                                                        <FaReceipt size={18} />
                                                    </div>
                                                    <div>
                                                        <h6 className="text-white fw-bold mb-0">{record.paymentMonth}</h6>
                                                        <p className="text-white-50 small mb-0" style={{ fontSize: "0.65rem" }}>
                                                            On {new Date(record.transactionDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-center d-none d-md-block opacity-75">
                                                    <div className="badge bg-dark bg-opacity-50 text-white-50 border border-white border-opacity-10 px-2 py-1 fw-bold" style={{ fontSize: "0.55rem", letterSpacing: "1px" }}>
                                                        REF: {record.referenceId}
                                                    </div>
                                                </div>

                                                <div className="text-end d-flex align-items-center gap-4">
                                                    <div>
                                                        <h5 className="text-success fw-bold mb-0">₹{record.amount.toLocaleString()}</h5>
                                                        <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20 px-2 py-0.5 rounded-pill extra-small fw-bold" style={{ fontSize: "0.5rem" }}>
                                                            <FaCheckCircle className="me-1 animate-pulse" /> {record.status?.toUpperCase() || 'PAID'}
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-outline-info btn-sm rounded-circle p-1 border-0 hover-scale-up" style={{ width: "32px", height: "32px", background: "rgba(0, 255, 255, 0.05)" }}>
                                                        <FaReceipt size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <div className="mb-3 text-white-25"><FaHistory size={48} /></div>
                                        <h6 className="text-white-50">No payout records found.</h6>
                                        <p className="text-white-25 small">Salary disbursements will appear here once processed by HR.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <style>{`
                .text-purple { color: #a855f7; }
                .bg-purple { background-color: rgba(168, 85, 247, 0.1); }
                
                .salary-pill {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                }

                .salary-pill:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.1);
                    transform: translateX(5px);
                }

                .icon-box {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                }

                .hover-glow:hover {
                    color: #60a5fa !important;
                    text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
                }

                @keyframes glow {
                    0% { box-shadow: 0 0 10px rgba(37, 99, 235, 0.1); }
                    50% { box-shadow: 0 0 25px rgba(37, 99, 235, 0.2); }
                    100% { box-shadow: 0 0 10px rgba(37, 99, 235, 0.1); }
                }

                .animate-glow {
                    animation: glow 4s infinite ease-in-out;
                }

                .transition-all { transition: all 0.2s ease; }
                .hover-bg-light:hover { background: rgba(255, 255, 255, 0.03); }
            `}</style>
        </div>
    );
}

export default EmployeeSalary;