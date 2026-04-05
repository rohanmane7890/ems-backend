import React, { useState, useEffect, useCallback } from "react";
import { getPendingLeaves, updateLeaveStatus } from "../services/EmployeeService";
import { FaCheck, FaTimes, FaUser, FaCalendarAlt, FaEnvelope, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminLeaveManagement() {
    const navigate = useNavigate();
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = useCallback(async () => {
        try {
            const res = await getPendingLeaves();
            setPendingLeaves(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching pending leaves", error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "ADMIN") {
            navigate("/login");
            return;
        }
        // eslint-disable-next-line
        fetchPending();
    }, [navigate, fetchPending]);

    const handleAction = async (id, status) => {
        try {
            await updateLeaveStatus(id, status);
            toast.success(`Leave request ${status.toLowerCase()}!`);
            fetchPending();
        } catch (error) {
            console.error("Failed to update leave status", error);
            toast.error("Failed to update leave status");
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 0" }}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2 className="fw-bold text-dark d-flex align-items-center mb-0">
                        <FaExclamationCircle className="text-warning me-2" /> Pending Leave Requests
                    </h2>
                    <button className="btn btn-outline-secondary" onClick={() => navigate("/admin-dashboard")}>
                        Back to Dashboard
                    </button>
                </div>

                {Array.isArray(pendingLeaves) && pendingLeaves.length > 0 ? (
                    <div className="row g-4">
                        {pendingLeaves.map((leave) => (
                            <div key={leave.id} className="col-md-6 col-lg-4">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="p-3 bg-light rounded-circle me-3">
                                                <FaUser className="text-primary" />
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-0">{leave.employeeName || "Employee"}</h5>
                                                <span className="small text-muted d-flex align-items-center">
                                                    <FaEnvelope className="me-1" size={12} /> {leave.employeeEmail || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <hr />

                                        <div className="mb-3">
                                            <div className="small text-muted fw-bold text-uppercase mb-1">Leave Type & Period</div>
                                            <div className="fw-medium d-flex align-items-center">
                                                <FaCalendarAlt className="text-secondary me-2" /> {leave.type}
                                            </div>
                                            <div className="small text-dark mt-1">
                                                {leave.startDate} to {leave.endDate}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="small text-muted fw-bold text-uppercase mb-1">Reason</div>
                                            <p className="card-text small bg-light p-2 rounded" style={{ height: "60px", overflowY: "auto" }}>
                                                {leave.reason}
                                            </p>
                                        </div>

                                        <div className="d-flex gap-2 pt-2">
                                            <button 
                                                className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center fw-bold"
                                                onClick={() => handleAction(leave.id, "APPROVED")}
                                            >
                                                <FaCheck className="me-2" /> Approve
                                            </button>
                                            <button 
                                                className="btn btn-danger flex-grow-1 d-flex align-items-center justify-content-center fw-bold"
                                                onClick={() => handleAction(leave.id, "REJECTED")}
                                            >
                                                <FaTimes className="me-2" /> Reject
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-footer bg-white border-0 py-3 text-center small text-muted">
                                        Applied on: {leave.appliedOn}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5 bg-white shadow-sm rounded-4" style={{ borderRadius: "20px" }}>
                        <div className="mb-3"><FaCheck className="text-success fs-1" /></div>
                        <h4 className="fw-bold text-muted">No Pending Requests</h4>
                        <p className="mb-0 text-muted">All clear! There are no leave requests to process at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminLeaveManagement;
