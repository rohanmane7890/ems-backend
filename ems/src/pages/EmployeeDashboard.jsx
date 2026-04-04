import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEmployeeByEmail, getAttendanceHistory, getNotifications, markNotificationAsRead, getAllEmployees } from "../services/EmployeeService";
import { 
    FaUserCircle, FaClock, FaCalendarCheck, FaFileAlt, 
    FaBell, FaSignOutAlt, FaCheckCircle, FaTimesCircle, FaFileExcel
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

function EmployeeDashboard() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        const email = localStorage.getItem("loggedInEmail");
        const role = localStorage.getItem("role");
        
        if (!email || role !== "EMPLOYEE") {
            navigate("/login");
            return;
        }

        fetchData(email);
    }, [navigate]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggleNotifications = async () => {
        setShowNotifications(prev => !prev);
        // Mark all unread as read
        const unread = Array.isArray(notifications) ? notifications.filter(n => !n.isRead) : [];
        if (unread.length > 0) {
            try {
                await Promise.all(unread.map(n => markNotificationAsRead(n.id)));
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            } catch {}
        }
    };

    const fetchData = async (email) => {
        try {
            const empRes = await getEmployeeByEmail(email);
            const empData = empRes.data;
            setEmployee(empData);

            // Load secondary data independently so it doesn't block the dashboard
            try {
                const [attRes, noteRes] = await Promise.all([
                    getAttendanceHistory(empData.id),
                    getNotifications(empData.id)
                ]);
                setAttendance(attRes.data);
                setNotifications(noteRes.data);
                const today = new Date().toLocaleDateString('en-CA');
                const todayRecord = Array.isArray(attRes.data) ? attRes.data.find(a => a.date === today) : null;
                setTodayAttendance(todayRecord);
            } catch (secErr) {
                console.warn("Could not load attendance/notifications", secErr);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching employee data", error);
            const msg = error?.response?.status === 401
                ? "Session expired. Please log in again."
                : error?.response?.status === 404
                ? "Employee account not found. Contact admin."
                : "Cannot reach server. Please ensure the backend is running.";
            setError(msg);
            toast.error(msg);
            setLoading(false);
        }
    };

    const exportToExcel = async () => {
        try {
            const res = await getAllEmployees();
            const data = res.data.map(({id, firstName, lastName, email, phoneNumber, department, joiningDate, status}) => ({
                ID: id, Name: `${firstName} ${lastName}`, Email: email, Phone: phoneNumber, Dept: department, Date: joiningDate, Status: status
            }));
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Employees");
            XLSX.writeFile(wb, "Employee_List.xlsx");
            toast.success("Excel exported successfully!");
        } catch (error) {
           toast.error("Failed to export Excel");
        }
    };


    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
    if (!employee) return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <div className="text-center p-5">
                <div style={{ fontSize: "4rem" }}>⚠️</div>
                <h4 className="mt-3 fw-bold text-danger">Unable to Load Dashboard</h4>
                <p className="text-muted">{error || "Could not fetch your employee data. Please check your connection or try logging in again."}</p>
                <button className="btn btn-primary mt-2" onClick={() => navigate("/login")}>Back to Login</button>
            </div>
        </div>
    );

    

    return (
        <div style={{ 
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", 
            minHeight: "100vh",
            fontFamily: "'Inter', sans-serif"
        }}>

            <div className="container py-5">
                <div className="row g-4">
                    {/* Welcome Section */}
                    <div className="col-12 mb-2">
                        <div className="card border-0 shadow-2xl p-4 bg-primary text-white" style={{ borderRadius: "20px", background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)" }}>
                            <h2 className="fw-bold mb-1" style={{ letterSpacing: "-1px" }}>Hello, {employee.firstName}! 👋</h2>
                            <p className="mb-0 opacity-75">Welcome to your dashboard. Stay productive and track your progress.</p>
                        </div>
                    </div>

                    {/* Navigation Cards */}
                    <div className="col-lg-12">
                        <div className="row g-4">
                            {[
                                { title: "My Profile", icon: <FaUserCircle />, link: "/employee-profile", desc: "View & edit your information", color: "indigo" },
                                { title: "Attendance History", icon: <FaCalendarCheck />, link: "/attendance", desc: "View your monthly records", color: "teal" },
                                { title: "Leave Management", icon: <FaFileAlt />, link: "/leaves", desc: "Apply and track leaves", color: "orange" }
                            ].map((item, idx) => (
                                <div key={idx} className="col-md-6 col-xl-4">
                                    <Link to={item.link} className="text-decoration-none">
                                    <div className="card border-0 shadow-2xl h-100 text-center p-4 action-card" 
                                             style={{ 
                                                 borderRadius: "20px", 
                                                 transition: "0.4s",
                                                 background: "rgba(30, 41, 59, 0.7)",
                                                 backdropFilter: "blur(12px)",
                                                 border: "1px solid rgba(255, 255, 255, 0.1)"
                                             }}>
                                            <div className="mb-3">
                                                <span style={{ fontSize: "2.5rem", color: item.color }}>{item.icon}</span>
                                            </div>
                                            <h5 className="fw-bold text-white">{item.title}</h5>
                                            <p className="text-white-50 small mb-0">{item.desc}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        
                        {/* Recent Activity Mini Table */}
                        <div className="card border-0 shadow-2xl mt-4 p-4" style={{ 
                            borderRadius: "20px",
                            background: "rgba(30, 41, 59, 0.7)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            color: "white"
                        }}>
                            <h5 className="fw-bold mb-3 d-flex align-items-center text-white text-uppercase small" style={{ letterSpacing: "1px" }}>
                                <FaCalendarCheck className="me-2 text-info" /> Recent Attendance History
                            </h5>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0 text-white">
                                    <thead style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                                        <tr className="text-white-50">
                                            <th>Date</th>
                                            <th>Check-In</th>
                                            <th>Check-Out</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(attendance) && attendance.length > 0 ? (
                                            attendance.slice(-5).reverse().map((att, i) => (
                                                <tr key={i}>
                                                    <td>{att.date}</td>
                                                    <td>{att.checkIn ? att.checkIn.split('.')[0] : '--:--'}</td>
                                                    <td>{att.checkOut ? att.checkOut.split('.')[0] : '--:--'}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill bg-${att.status === 'PRESENT' ? 'success' : 'danger'}`}>
                                                            {att.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted py-3">No recent activity detected</td>
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
                .action-card:hover {
                    transform: translateY(-5px);
                    background-color: rgba(59, 130, 246, 0.1) !important;
                    border-color: rgba(59, 130, 246, 0.5) !important;
                }
            `}</style>
        </div>
    );
}

export default EmployeeDashboard;