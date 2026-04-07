import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllEmployees, updateEmployee, paySalary, getSalaryHistory } from "../services/EmployeeService";
import { FaMoneyBillWave, FaArrowLeft, FaEdit, FaSearch, FaTimes, FaSave, FaCreditCard, FaHistory } from "react-icons/fa";
import { toast } from "react-toastify";

function AdminSalaryManagement() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [tempSalary, setTempSalary] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Payment Modal State
    const [showPayModal, setShowPayModal] = useState(false);
    const [payMonth, setPayMonth] = useState("");
    const [isPaying, setIsPaying] = useState(false);

    // History Modal State
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [salaryHistory, setSalaryHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await getAllEmployees();
            setEmployees(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch employees", error);
            setLoading(false);
            toast.error("Could not load employee data.");
        }
    };

    const handleViewHistory = async (emp) => {
        setSelectedEmployee(emp);
        setShowHistoryModal(true);
        setHistoryLoading(true);
        try {
            const res = await getSalaryHistory(emp.id);
            setSalaryHistory(res.data || []);
        } catch (error) {
            toast.error("Failed to fetch payment history.");
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleEditSalary = (emp) => {
        setSelectedEmployee(emp);
        setTempSalary(emp.salary || "");
        setShowModal(true);
    };

    const handleSaveSalary = async () => {
        if (!selectedEmployee) return;
        setIsSaving(true);
        try {
            const updatedData = { ...selectedEmployee, salary: tempSalary };
            await updateEmployee(selectedEmployee.id, updatedData);
            toast.success("Monthly salary updated successfully!");
            setShowModal(false);
            fetchEmployees();
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update salary.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePaySalary = (emp) => {
        setSelectedEmployee(emp);
        const now = new Date();
        const monthYear = now.toLocaleString('default', { month: 'long', year: 'numeric' });
        setPayMonth(monthYear);
        setShowPayModal(true);
    };

    const confirmPayment = async () => {
        if (!selectedEmployee) return;
        setIsPaying(true);
        try {
            const paymentData = {
                employeeId: selectedEmployee.id,
                amount: selectedEmployee.salary,
                paymentMonth: payMonth
            };
            await paySalary(paymentData);
            toast.success(`Salary payment recorded for ${selectedEmployee.firstName} - ${payMonth}`);
            setShowPayModal(false);
        } catch (error) {
            console.error("Payment failed", error);
            toast.error("Failed to record payment.");
        } finally {
            setIsPaying(false);
        }
    };

    const filteredEmployees = employees.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "#0f172a" }}>
            <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div style={{ 
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", 
            minHeight: "100vh",
            padding: "40px 0",
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="container">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <button 
                            className="btn btn-link text-info p-0 mb-2 text-decoration-none d-flex align-items-center fw-bold"
                            onClick={() => navigate("/admin-dashboard")}
                        >
                            <FaArrowLeft className="me-2" /> Back to Dashboard
                        </button>
                        <h2 className="text-white fw-bold mb-0" style={{ letterSpacing: "-1px" }}>
                            <FaMoneyBillWave className="me-3 text-success" /> Salary Management
                        </h2>
                        <p className="text-info opacity-75 mb-0">Monitor and update organization payroll</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="card border-0 mb-4 shadow-lg" style={{ borderRadius: "15px", background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", backdropFilter: "blur(12px)" }}>
                    <div className="card-body p-3">
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-0 text-info">
                                <FaSearch />
                            </span>
                            <input 
                                type="text" 
                                className="form-control bg-transparent border-0 text-white placeholder-info" 
                                placeholder="Search by name, email or department..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ boxShadow: "none" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Salary Table */}
                <div className="card border-0 shadow-2xl overflow-hidden" 
                     style={{ 
                         background: "rgba(30, 41, 59, 0.4)", 
                         borderRadius: "24px", 
                         border: "1px solid rgba(255, 255, 255, 0.05)",
                         backdropFilter: "blur(20px)"
                     }}>
                    <div className="table-responsive">
                        <table className="table table-borderless align-middle mb-0 text-white" style={{ background: "transparent" }}>
                            <thead style={{ background: "rgba(15, 23, 42, 0.6)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                                <tr className="text-info small fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>
                                    <th className="py-4 px-4 border-0">Employee</th>
                                    <th className="py-4 border-0">Basic (60%)</th>
                                    <th className="py-4 border-0">HRA (30%)</th>
                                    <th className="py-4 border-0">Bonus (10%)</th>
                                    <th className="py-4 border-0">Total Monthly</th>
                                    <th className="py-4 border-0 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((emp) => {
                                        const salary = emp.salary || 0;
                                        const basic = Math.round(salary * 0.6);
                                        const hra = Math.round(salary * 0.3);
                                        const bonus = Math.round(salary * 0.1);

                                        return (
                                            <tr key={emp.id} className="admin-salary-row border-bottom border-secondary border-opacity-10" style={{ transition: "all 0.3s ease", background: "transparent" }}>
                                                <td className="py-4 px-4 bg-transparent">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded-circle bg-info bg-opacity-20 d-flex align-items-center justify-content-center me-3 text-info fw-bold shadow-sm" style={{ width: "45px", height: "45px", fontSize: "0.9rem", border: "1px solid rgba(0, 255, 255, 0.2)" }}>
                                                            {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-white mb-0" style={{ fontSize: "0.95rem" }}>{emp.firstName} {emp.lastName}</div>
                                                            <div className="text-info opacity-75 small" style={{ fontSize: "0.75rem" }}>{emp.department || "N/A"}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 bg-transparent">
                                                    <div className="text-white-50 small mb-1" style={{ fontSize: "0.7rem" }}>Fixed</div>
                                                    <div className="fw-bold text-white">₹{basic.toLocaleString()}</div>
                                                </td>
                                                <td className="py-4 bg-transparent">
                                                    <div className="text-white-50 small mb-1" style={{ fontSize: "0.7rem" }}>Allowance</div>
                                                    <div className="fw-bold text-white">₹{hra.toLocaleString()}</div>
                                                </td>
                                                <td className="py-4 bg-transparent">
                                                    <div className="text-white-50 small mb-1" style={{ fontSize: "0.7rem" }}>Variable</div>
                                                    <div className="fw-bold text-white">₹{bonus.toLocaleString()}</div>
                                                </td>
                                                <td className="py-4 bg-transparent">
                                                    <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 fw-bold" style={{ fontSize: "1rem" }}>
                                                        ₹{salary.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 text-center bg-transparent">
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <button 
                                                            className="btn btn-sm text-white rounded-pill px-3 py-2 fw-bold shadow-lg hover-grow"
                                                            onClick={() => handleEditSalary(emp)}
                                                            style={{ 
                                                                fontSize: "0.75rem", 
                                                                background: "rgba(255, 255, 255, 0.05)",
                                                                border: "1px solid rgba(255, 255, 255, 0.1)"
                                                            }}
                                                        >
                                                            <FaEdit className="me-1" /> EDIT
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm text-white rounded-pill px-3 py-2 fw-bold shadow-lg hover-grow"
                                                            onClick={() => handleViewHistory(emp)}
                                                            style={{ 
                                                                fontSize: "0.75rem", 
                                                                background: "rgba(0, 255, 255, 0.08)",
                                                                border: "1px solid rgba(0, 255, 255, 0.2)"
                                                            }}
                                                        >
                                                            <FaHistory className="me-1 text-info" /> HISTORY
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm text-white rounded-pill px-3 py-2 fw-bold shadow-lg hover-grow"
                                                            onClick={() => handlePaySalary(emp)}
                                                            style={{ 
                                                                fontSize: "0.75rem", 
                                                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                                                border: "none",
                                                                boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)"
                                                            }}
                                                        >
                                                            <FaCreditCard className="me-1" /> PAY NOW
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-info opacity-50 fw-bold">
                                            No organization members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="row mt-5 g-4">
                    <div className="col-md-4">
                        <div className="card shadow-lg border-0 p-4 rounded-4" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", backdropFilter: "blur(10px)" }}>
                            <h6 className="text-success fw-bold mb-1 opacity-75">Monthly Payroll</h6>
                            <h3 className="text-white fw-bold mb-0">
                                ₹{filteredEmployees.reduce((sum, e) => sum + Number(e.salary || 0), 0).toLocaleString()}
                            </h3>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-lg border-0 p-4 rounded-4" style={{ background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)", backdropFilter: "blur(10px)" }}>
                            <h6 className="text-info fw-bold mb-1 opacity-75">Total Employees</h6>
                            <h3 className="text-white fw-bold mb-0">{filteredEmployees.length}</h3>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-lg border-0 p-4 rounded-4" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)" }}>
                            <h6 className="text-white fw-bold mb-1 opacity-50">Average Salary</h6>
                            <h3 className="text-white fw-bold mb-0">
                                ₹{filteredEmployees.length > 0 ? Math.round(filteredEmployees.reduce((sum, e) => sum + Number(e.salary || 0), 0) / filteredEmployees.length).toLocaleString() : 0}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Salary Update Modal */}
            {showModal && (
                <div className="custom-modal-overlay d-flex align-items-center justify-content-center">
                    <div className="custom-modal-content card shadow-2xl p-0 overflow-hidden" 
                         style={{ 
                             width: "450px", 
                             background: "#1e293b", 
                             borderRadius: "28px", 
                             border: "1px solid rgba(255, 255, 255, 0.1)",
                             animation: "modalFadeUp 0.3s ease-out"
                         }}>
                        <div className="p-4 bg-info bg-opacity-10 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25">
                            <h5 className="text-white fw-bold mb-0">Update Monthly Salary</h5>
                            <button className="btn btn-link text-info p-0" onClick={() => setShowModal(false)}>
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="text-center mb-4">
                                <div className="rounded-circle bg-info bg-opacity-20 d-inline-flex align-items-center justify-content-center mb-3 text-info fw-bold" style={{ width: "60px", height: "60px", fontSize: "1.2rem", border: "1px solid rgba(0, 255, 255, 0.2)" }}>
                                    {selectedEmployee?.firstName?.charAt(0)}{selectedEmployee?.lastName?.charAt(0)}
                                </div>
                                <h6 className="text-white fw-bold mb-1">{selectedEmployee?.firstName} {selectedEmployee?.lastName}</h6>
                                <p className="text-info opacity-75 small">{selectedEmployee?.department} | {selectedEmployee?.email}</p>
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label text-info fw-bold small opacity-75 mb-2">New Monthly Salary (₹)</label>
                                <input 
                                    type="number" 
                                    className="form-control bg-transparent text-white border-secondary border-opacity-50 py-3 fw-bold"
                                    value={tempSalary}
                                    onChange={(e) => setTempSalary(e.target.value)}
                                    placeholder="Enter total amount"
                                    style={{ borderRadius: "14px", fontSize: "1.1rem" }}
                                    autoFocus
                                />
                            </div>

                            <button 
                                className="btn w-100 py-3 rounded-pill text-white fw-bold d-flex align-items-center justify-content-center shadow-lg"
                                style={{ 
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    border: "none",
                                    fontSize: "1rem"
                                }}
                                onClick={handleSaveSalary}
                                disabled={isSaving || !tempSalary}
                            >
                                {isSaving ? (
                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                ) : (
                                    <FaSave className="me-2" />
                                )}
                                SAVE UPDATED SALARY
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Confirmation Modal */}
            {showPayModal && (
                <div className="custom-modal-overlay d-flex align-items-center justify-content-center">
                    <div className="custom-modal-content card shadow-2xl p-0 overflow-hidden" 
                         style={{ 
                             width: "480px", 
                             background: "#1e293b", 
                             borderRadius: "28px", 
                             border: "1px solid rgba(255, 255, 255, 0.1)",
                             animation: "modalFadeUp 0.3s ease-out"
                         }}>
                        <div className="p-4 bg-success bg-opacity-10 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25">
                            <h5 className="text-white fw-bold mb-0">Disburse Salary</h5>
                            <button className="btn btn-link text-info p-0" onClick={() => setShowPayModal(false)}>
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="text-center mb-4">
                                <div className="rounded-circle bg-success bg-opacity-20 d-inline-flex align-items-center justify-content-center mb-3 text-success fw-bold" style={{ width: "70px", height: "70px", fontSize: "1.4rem", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                                    <FaMoneyBillWave size={30} />
                                </div>
                                <h4 className="text-white fw-bold mb-1">₹{(selectedEmployee?.salary || 0).toLocaleString()}</h4>
                                <p className="text-success small fw-bold text-uppercase">Payment to {selectedEmployee?.firstName} {selectedEmployee?.lastName}</p>
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label text-info fw-bold small opacity-75 mb-2">Benefit Period (Month/Year)</label>
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent text-white border-secondary border-opacity-50 py-3"
                                    value={payMonth}
                                    onChange={(e) => setPayMonth(e.target.value)}
                                    placeholder="e.g. April 2026"
                                    style={{ borderRadius: "14px", fontWeight: "600" }}
                                />
                            </div>

                            <div className="p-3 mb-4 rounded-4 small" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                <div className="d-flex justify-content-between text-white-50 mb-2">
                                    <span>Base Pay:</span>
                                    <span className="text-white fw-bold">₹{Math.round((selectedEmployee?.salary || 0) * 0.6).toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between text-white-50">
                                    <span>Allowances:</span>
                                    <span className="text-white fw-bold">₹{Math.round((selectedEmployee?.salary || 0) * 0.4).toLocaleString()}</span>
                                </div>
                            </div>

                            <button 
                                className="btn w-100 py-3 rounded-pill text-white fw-bold d-flex align-items-center justify-content-center shadow-lg"
                                style={{ 
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    border: "none",
                                    fontSize: "1rem"
                                }}
                                onClick={confirmPayment}
                                disabled={isPaying || !payMonth}
                            >
                                {isPaying ? (
                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                ) : (
                                    <FaCreditCard className="me-2" />
                                )}
                                CONFIRM & RECORD DISBURSEMENT
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Salary History Modal */}
            {showHistoryModal && (
                <div className="custom-modal-overlay d-flex align-items-center justify-content-center">
                    <div className="custom-modal-content card shadow-2xl p-0 overflow-hidden" 
                         style={{ 
                             width: "650px", 
                             background: "#0f172a", 
                             borderRadius: "28px", 
                             border: "1px solid rgba(255, 255, 255, 0.1)",
                             animation: "modalFadeUp 0.3s ease-out"
                         }}>
                        <div className="p-4 bg-info bg-opacity-10 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25">
                            <h5 className="text-white fw-bold mb-0">Payment History: {selectedEmployee?.firstName}</h5>
                            <button className="btn btn-link text-info p-0" onClick={() => setShowHistoryModal(false)}>
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="p-0" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            {historyLoading ? (
                                <div className="p-5 text-center"><div className="spinner-border text-info"></div></div>
                            ) : salaryHistory.length > 0 ? (
                                <table className="table table-dark table-hover table-borderless align-middle mb-0">
                                    <thead className="sticky-top bg-dark text-info small fw-bold">
                                        <tr style={{ background: "rgba(30, 41, 59, 0.9)" }}>
                                            <th className="p-4">Period</th>
                                            <th>Amount</th>
                                            <th>Disbursed On</th>
                                            <th className="text-center">Reference</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salaryHistory.sort((a,b) => new Date(b.transactionDate) - new Date(a.transactionDate)).map((record) => (
                                            <tr key={record.id} className="border-bottom border-white border-opacity-5">
                                                <td className="p-4 fw-bold">{record.paymentMonth}</td>
                                                <td>₹{record.amount.toLocaleString()}</td>
                                                <td className="small text-white-50">{new Date(record.transactionDate).toLocaleDateString()}</td>
                                                <td className="text-center"><span className="badge bg-secondary extra-small fw-bold">{record.referenceId}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-5 text-center text-white-50">No disbursement history found for this employee.</div>
                            )}
                        </div>
                        <div className="p-4 bg-dark bg-opacity-50 text-center">
                            <button className="btn btn-outline-info rounded-pill px-4 btn-sm fw-bold" onClick={() => setShowHistoryModal(false)}>CLOSE VIEWER</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 23, 42, 0.85);
                    backdrop-filter: blur(8px);
                    z-index: 1050;
                }
                @keyframes modalFadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .admin-salary-row:hover {
                    background: rgba(255, 255, 255, 0.05) !important;
                }
                .hover-grow:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                }
                .placeholder-info::placeholder {
                    color: rgba(0, 255, 255, 0.4);
                }
                .table-responsive::-webkit-scrollbar {
                    height: 8px;
                }
                .table-responsive::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}

export default AdminSalaryManagement;
