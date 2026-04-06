import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClock, FaMapMarkerAlt, FaCalendarCheck, FaChartBar, FaUserCheck, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmployeeAttendance = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [attendanceRecord, setAttendanceRecord] = useState([]);
    const [status, setStatus] = useState("Offline");
    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const employeeId = localStorage.getItem("employeeId");
    const loggedInEmail = localStorage.getItem("loggedInEmail");

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchAttendanceData();
        return () => clearInterval(timer);
    }, []);

    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get(`/api/attendance/employee/${employeeId}`);
            const data = Array.isArray(response.data) ? response.data : [];
            setAttendanceRecord(data);
            
            // Check if today is already "Present"
            const today = new Date().toISOString().split('T')[0];
            const hasPunchedIn = data.some(rec => rec.date === today);
            setIsPunchedIn(hasPunchedIn);
            setStatus(hasPunchedIn ? "Active" : "Offline");
            
            setLoading(false);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            setLoading(false);
        }
    };

    const handlePunchIn = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const attendanceData = {
                employeeId: employeeId,
                email: loggedInEmail,
                date: today,
                status: "Present",
                checkInTime: new Date().toLocaleTimeString()
            };

            await axios.post('/api/attendance', attendanceData);
            toast.success("✨ Shift Started! Pulse Synchronized.");
            setIsPunchedIn(true);
            setStatus("Active");
            fetchAttendanceData();
        } catch (error) {
            toast.error("Clock-in failed. Please try again.");
        }
    };

    return (
        <div className="container-fluid py-5" style={{ 
            background: "radial-gradient(circle at top left, #0f172a 0%, #1e293b 100%)", 
            minHeight: "100vh", 
            fontFamily: "'Inter', sans-serif",
            color: "#fff"
        }}>
            <div className="container">
                {/* 🛡️ Header Component */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <button 
                            className="btn btn-link text-info p-0 mb-3 text-decoration-none d-flex align-items-center fw-bold"
                            onClick={() => navigate("/employee-dashboard")}
                        >
                            <FaArrowLeft className="me-2" /> Back to Nexus
                        </button>
                        <h2 className="fw-bold display-6 mb-1 text-white" style={{ letterSpacing: "-1.5px" }}>Attendance Portal</h2>
                        <p className="text-info opacity-75 mb-0">NexGen Workforce | Time & Presence Sync</p>
                    </div>
                    <div className="text-end">
                        <div className="h4 fw-bold mb-0 text-white">{currentTime.toLocaleTimeString()}</div>
                        <div className="small text-info opacity-50">{currentTime.toDateString()}</div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* 🕒 Live Status Card */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-2xl h-100" style={{ 
                            background: "rgba(30, 41, 59, 0.7)", 
                            borderRadius: "28px", 
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                            <div className="card-body p-5 text-center">
                                <div className="position-relative d-inline-block mb-4">
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${isPunchedIn ? 'bg-success' : 'bg-secondary'} bg-opacity-10`} style={{ width: "120px", height: "120px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                                        <FaUserCheck className={`display-4 ${isPunchedIn ? 'text-success' : 'text-white-50'}`} />
                                    </div>
                                    {isPunchedIn && (
                                        <span className="position-absolute bottom-0 end-0 p-2 bg-success border border-light rounded-circle shadow-lg pulse-bg"></span>
                                    )}
                                </div>
                                <h3 className="fw-bold mb-1">Status: {status}</h3>
                                <p className="text-info small mb-4 opacity-50">Department Synchronization Active</p>
                                
                                <button 
                                    className={`btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-lg transition-all ${isPunchedIn ? 'btn-outline-success disabled' : 'btn-primary-gradient'}`}
                                    onClick={handlePunchIn}
                                    style={{ letterSpacing: "1px" }}
                                    disabled={isPunchedIn}
                                >
                                    {isPunchedIn ? "PUNCHED IN" : "START SHIFT"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 📊 Presence Statistics */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-2xl overflow-hidden" style={{ 
                            background: "rgba(30, 41, 59, 0.4)", 
                            borderRadius: "28px", 
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.05)"
                        }}>
                            <div className="p-4 bg-info bg-opacity-5 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold"><FaCalendarCheck className="me-2 text-info" /> Recent Attendance Logs</h5>
                                <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill small">Last 30 Days</span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-borderless align-middle mb-0 text-white">
                                    <thead className="bg-black bg-opacity-20 text-info small fw-bold text-uppercase">
                                        <tr>
                                            <th className="py-4 ps-5">Date</th>
                                            <th className="py-4">Designation Status</th>
                                            <th className="py-4">Arrival</th>
                                            <th className="py-4 text-center pe-5">Metrics</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(attendanceRecord) && attendanceRecord.length > 0 ? (
                                            attendanceRecord.slice(0, 7).map((rec, idx) => (
                                                <tr key={idx} className="border-bottom border-white border-opacity-5 hover-bg-white-5 transition-all">
                                                    <td className="py-4 ps-5">
                                                        <div className="fw-bold">{rec.date}</div>
                                                        <div className="small text-info opacity-50">Pulse-ID: {rec.id}</div>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
                                                            {rec.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="d-flex align-items-center">
                                                            <FaClock className="me-2 text-info opacity-50" />
                                                            {rec.checkInTime || "09:00 AM"}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-center pe-5">
                                                        <div className="small text-white-50">On-Time</div>
                                                        <div className="progress mt-1" style={{ height: "4px", background: "rgba(255,255,255,0.1)" }}>
                                                            <div className="progress-bar bg-info" style={{ width: "100%" }}></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-white-50">
                                                    No attendance data synced yet.
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

            <style>{`
                .btn-primary-gradient {
                    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                    border: none;
                    color: white;
                }
                .btn-primary-gradient:hover {
                    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
                    transform: translateY(-2px);
                }
                .pulse-bg {
                    animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
                }
                .hover-bg-white-5:hover {
                    background: rgba(255, 255, 255, 0.03);
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default EmployeeAttendance;
