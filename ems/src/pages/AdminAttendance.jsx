import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaUserCheck, FaUserTimes, FaArrowLeft, FaSearch, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8082/api/attendance";

function AdminAttendance() {
    const navigate = useNavigate();
    const [attendanceList, setAttendanceList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const isToday = selectedDate === new Date().toISOString().split("T")[0];

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (!role || role !== "ADMIN") {
            navigate("/login");
        } else {
            fetchAttendance();
        }
    }, [selectedDate, navigate]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/date?date=${selectedDate}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAttendanceList(response.data);
        } catch (error) {
            console.error("Error fetching attendance", error);
            toast.error("Failed to load attendance records");
        } finally {
            setLoading(false);
        }
    };

    const handleManualCheckIn = async (employeeId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/check-in/${employeeId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Employee checked in successfully");
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data || "Manual check-in failed");
        }
    };

    const handleManualCheckOut = async (employeeId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/check-out/${employeeId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Employee checked out successfully");
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data || "Manual check-out failed");
        }
    };

    const safeList = Array.isArray(attendanceList) ? attendanceList : [];

    const filteredList = safeList.filter(record => 
        `${record.firstName || ''} ${record.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.designation?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ 
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", 
            minHeight: "100vh",
            padding: "2rem",
            color: "#fff",
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="container">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <button 
                        onClick={() => navigate("/admin-dashboard")}
                        className="btn btn-link text-white text-decoration-none d-flex align-items-center opacity-75 hover-opacity-100"
                        style={{ fontSize: "0.9rem" }}
                    >
                        <FaArrowLeft className="me-2" /> Back to Dashboard
                    </button>
                    <div className="text-end">
                        <h2 className="fw-bold mb-0" style={{ letterSpacing: "-1px" }}>Attendance Tracker</h2>
                        <p className="text-info small mb-0">Daily monitoring and management</p>
                    </div>
                </div>

                {/* Control Panel */}
                <div className="row g-4 mb-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-lg p-4 h-100" style={{ 
                            background: "rgba(30, 41, 59, 0.7)", 
                            backdropFilter: "blur(12px)",
                            borderRadius: "20px",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                            <div className="row align-items-center">
                                <div className="col-md-5 mb-3 mb-md-0">
                                    <label className="small text-white-50 text-uppercase fw-bold mb-2 d-block">Select Date</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent border-end-0 text-info" style={{ border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                                            <FaCalendarAlt />
                                        </span>
                                        <input 
                                            type="date" 
                                            className="form-control bg-transparent text-white border-start-0"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            style={{ border: "1px solid rgba(255, 255, 255, 0.2)", colorScheme: "dark" }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <label className="small text-white-50 text-uppercase fw-bold mb-2 d-block">Quick Search</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent border-end-0 text-info" style={{ border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                                            <FaSearch />
                                        </span>
                                        <input 
                                            type="text" 
                                            className="form-control bg-transparent text-white border-start-0"
                                            placeholder="Search by name or designation..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ border: "1px solid rgba(255, 255, 255, 0.2)" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-lg p-4 h-100 text-center" style={{ 
                            background: "rgba(30, 41, 59, 0.7)", 
                            backdropFilter: "blur(12px)",
                            borderRadius: "20px",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                            <div className="d-flex justify-content-around h-100 align-items-center">
                                <div>
                                    <h3 className="text-success fw-bold mb-0">{safeList.filter(r => r.status === 'PRESENT').length}</h3>
                                    <p className="small text-white-50 mb-0">Present</p>
                                </div>
                                <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.1)" }}></div>
                                <div>
                                    <h3 className="text-info fw-bold mb-0">{safeList.length}</h3>
                                    <p className="small text-white-50 mb-0">Total Staff</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="card border-0 shadow-lg p-0 overflow-hidden" style={{ 
                    background: "rgba(30, 41, 59, 0.7)", 
                    backdropFilter: "blur(12px)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                    <div className="table-responsive">
                        <table className="table align-middle text-white mb-0">
                            <thead style={{ background: "rgba(255, 255, 255, 0.03)" }}>
                                <tr style={{ color: "rgba(148, 163, 184, 0.9)", fontWeight: "bold" }}>
                                    <th className="px-4 py-3 border-0">Employee</th>
                                    <th className="py-3 border-0">Designation</th>
                                    <th className="py-3 border-0 text-center">Check In</th>
                                    <th className="py-3 border-0 text-center">Check Out</th>
                                    <th className="py-3 border-0 text-center">Status</th>
                                    <th className="px-4 py-3 border-0 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="spinner-border text-info" role="status"></div>
                                            <p className="mt-2 text-white-50">Syncing organizational records...</p>
                                        </td>
                                    </tr>
                                ) : filteredList.length > 0 ? (
                                    filteredList.map((record) => (
                                        <tr key={record.employeeId} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle bg-primary bg-opacity-25 d-flex align-items-center justify-content-center me-3 fw-bold" style={{ width: "40px", height: "40px", fontSize: "0.9rem", color: "#4facfe", border: "1px solid rgba(79, 172, 254, 0.3)" }}>
                                                        {record.firstName?.[0]}{record.lastName?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">{record.firstName} {record.lastName}</div>
                                                        <div className="small" style={{ fontSize: "0.75rem", color: "#94a3b8" }}>ID: {record.employeeId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 small fw-medium" style={{ color: "#6366f1" }}>{record.designation || "N/A"}</td>
                                            <td className="py-3 text-center fw-bold" style={{ color: "#22d3ee" }}>
                                                {record.checkIn ? record.checkIn.split(".")[0] : "--:--"}
                                            </td>
                                            <td className="py-3 text-center fw-bold" style={{ color: "#22d3ee" }}>
                                                {record.checkOut ? record.checkOut.split(".")[0] : "--:--"}
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className={`badge rounded-pill px-3 py-2 ${record.status === 'PRESENT' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`} style={{ border: record.status === 'PRESENT' ? '1px solid rgba(25, 135, 84, 0.3)' : '1px solid rgba(220, 53, 69, 0.3)', fontSize: "0.7rem", letterSpacing: "1px" }}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <button 
                                                        onClick={() => handleManualCheckIn(record.employeeId)}
                                                        disabled={record.checkIn || !isToday}
                                                        className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-center px-3"
                                                        style={{ borderRadius: "8px", fontSize: "0.75rem" }}
                                                        title="Manual Check-In"
                                                    >
                                                        <FaSignInAlt className="me-1" /> IN
                                                    </button>
                                                    <button 
                                                        onClick={() => handleManualCheckOut(record.employeeId)}
                                                        disabled={!record.checkIn || record.checkOut || !isToday}
                                                        className="btn btn-sm btn-outline-warning d-flex align-items-center justify-content-center px-3"
                                                        style={{ borderRadius: "8px", fontSize: "0.75rem" }}
                                                        title="Manual Check-Out"
                                                    >
                                                        <FaSignOutAlt className="me-1" /> OUT
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-white-50 italic">
                                            No employee records available for tracking.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminAttendance;
