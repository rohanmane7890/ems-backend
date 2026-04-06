import React, { useState, useEffect } from "react";
import { applyLeave, getEmployeeLeaves, getEmployeeByEmail } from "../services/EmployeeService";
import { FaCalendarPlus, FaHistory, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function LeaveManagement() {
    const navigate = useNavigate();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [employeeId, setEmployeeId] = useState(null);
    const [leaveData, setLeaveData] = useState({
        startDate: "",
        endDate: "",
        reason: "",
        type: "Sick Leave"
    });

    useEffect(() => {
        const init = async () => {
            const email = localStorage.getItem("loggedInEmail");
            if (!email) {
                navigate("/login");
                return;
            }

            try {
                const userRes = await getEmployeeByEmail(email);
                const id = userRes?.data?.id || userRes?.data?.employeeId;
                if (!id) {
                    toast.error("Unable to resolve employee ID. Please log in again.");
                    navigate("/login");
                    return;
                }
                setEmployeeId(id);
                await fetchLeaves(id);
            } catch (err) {
                console.error("Error loading leave info", err);
                toast.error("Unable to fetch leave data.");
                setLoading(false);
            }
        };

        init();
    }, [navigate]);

    const fetchLeaves = async (id) => {
        setLoading(true);
        try {
            const targetId = id || employeeId;
            if (!targetId) {
                setLeaves([]);
                setLoading(false);
                return;
            }
            const res = await getEmployeeLeaves(targetId);
            setLeaves(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error fetching leaves", error);
            toast.error("Failed to load leaves.");
            setLeaves([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();

        if (!employeeId) {
            toast.error("Employee not identified. Please log in again.");
            return;
        }

        if (leaveData.endDate < leaveData.startDate) {
            toast.warn("End Date must be on or after Start Date.");
            return;
        }

        try {
            const payload = {
                ...leaveData,
                employeeId: employeeId,
                status: "PENDING",
                appliedOn: new Date().toLocaleDateString('en-CA')
            };
            await applyLeave(payload);
            toast.success("Leave application submitted!");
            setLeaveData({ startDate: "", endDate: "", reason: "", type: "Sick Leave" });
            await fetchLeaves(employeeId);
        } catch (error) {
            console.error("Leave apply error", error);
            toast.error("Failed to submit leave application");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "APPROVED":
                return { badge: "success", icon: <FaCheckCircle /> };
            case "REJECTED":
                return { badge: "danger", icon: <FaTimesCircle /> };
            default:
                return { badge: "warning", icon: <FaHourglassHalf /> };
        }
    };

    return (
        <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "40px 0" }}>
            <div className="container">
                <button
                    className="btn btn-outline-secondary mb-4 d-inline-flex align-items-center gap-2"
                    onClick={() => navigate("/employee-dashboard")}
                    style={{ borderRadius: "10px", fontWeight: 500 }}
                >
                    ← Back to Dashboard
                </button>

                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "15px" }}>
                            <h4 className="fw-bold mb-4 d-flex align-items-center">
                                <FaCalendarPlus className="text-primary me-2" /> Apply for Leave
                            </h4>
                            <form onSubmit={handleApply}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Leave Type</label>
                                    <select className="form-select" value={leaveData.type} onChange={(e) => setLeaveData({ ...leaveData, type: e.target.value })}>
                                        <option>Sick Leave</option>
                                        <option>Casual Leave</option>
                                        <option>Vacation</option>
                                        <option>Maternity/Paternity</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Start Date</label>
                                    <input type="date" className="form-control" value={leaveData.startDate} onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">End Date</label>
                                    <input type="date" className="form-control" value={leaveData.endDate} onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted">Reason</label>
                                    <textarea className="form-control" rows="3" value={leaveData.reason} onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
                                    Submit Application
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "15px" }}>
                            <h4 className="fw-bold mb-4 d-flex align-items-center">
                                <FaHistory className="text-secondary me-2" /> History & Status
                            </h4>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Type</th>
                                            <th>Period</th>
                                            <th>Status</th>
                                            <th>Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">
                                                    Loading leave history...
                                                </td>
                                            </tr>
                                        ) : Array.isArray(leaves) && leaves.length > 0 ? (
                                            leaves.map((leave, i) => {
                                                const style = getStatusStyle(leave.status);
                                                return (
                                                    <tr key={i}>
                                                        <td className="fw-medium">{leave.type || "General Leave"}</td>
                                                        <td>
                                                            <div className="small">{leave.startDate} to</div>
                                                            <div className="small">{leave.endDate}</div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge bg-${style.badge} d-inline-flex align-items-center`}>
                                                                <span className="me-1">{style.icon}</span> {leave.status}
                                                            </span>
                                                        </td>
                                                        <td className="small text-muted" title={leave.reason}>
                                                            {leave.reason?.length > 30 ? `${leave.reason.substring(0, 30)}...` : leave.reason}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">
                                                    No leave applications found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeaveManagement;
