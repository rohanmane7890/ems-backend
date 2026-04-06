import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEmployeeByEmail, getAttendanceHistory, getNotifications, markNotificationAsRead, getAllEmployees, getEmployeeTasks } from "../services/EmployeeService";
import { 
    FaUserCircle, FaClock, FaCalendarCheck, FaFileAlt, 
    FaBell, FaSignOutAlt, FaCheckCircle, FaTimesCircle, FaFileExcel, FaTasks
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
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ completed: 0, pending: 0, efficiency: 0 });
    const notifRef = useRef(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [todayAttendance, setTodayAttendance] = useState(null);

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
                const [attRes, noteRes, taskRes] = await Promise.all([
                    getAttendanceHistory(empData.id),
                    getNotifications(empData.id),
                    getEmployeeTasks(empData.id)
                ]);
                setAttendance(attRes.data);
                setNotifications(noteRes.data);
                setTasks(taskRes.data);

                // Calculate Stats
                const completed = taskRes.data.filter(t => t.status === 'COMPLETED').length;
                const pending = taskRes.data.filter(t => t.status !== 'COMPLETED').length;
                const total = taskRes.data.length;
                const efficiency = total > 0 ? Math.round((completed / total) * 100) : 0;
                setStats({ completed, pending, efficiency });

                const today = new Date().toLocaleDateString('en-CA');
                const todayRecord = Array.isArray(attRes.data) ? attRes.data.find(a => a.date === today) : null;
                setTodayAttendance(todayRecord);
            } catch (secErr) {
                console.warn("Could not load secondary data", secErr);
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
                    {/* Top Alert Bar for New Tasks */}
                    {notifications.filter(n => !n.isRead && n.type === 'TASK_ASSIGNED').length > 0 && (
                        <div className="col-12 mb-0">
                            <div className="alert border-0 shadow-sm d-flex align-items-center justify-content-between p-3" 
                                 style={{ 
                                     background: "rgba(59, 130, 246, 0.1)", 
                                     borderLeft: "4px solid #3b82f6 !important",
                                     borderRadius: "16px",
                                     backdropFilter: "blur(10px)"
                                 }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary p-2 rounded-circle animate-pulse">
                                        <FaBell className="text-white" />
                                    </div>
                                    <div>
                                        <strong className="text-white d-block">NexGen Nexus Alert</strong>
                                        <span className="text-white-50 small">You have {notifications.filter(n => !n.isRead).length} unread task assignments.</span>
                                    </div>
                                </div>
                                <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" onClick={handleToggleNotifications}>
                                    View All
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Welcome Section with Notification Bell */}
                    <div className="col-12 mb-2">
                        <div className="card border-0 shadow-2xl p-4 bg-primary text-white position-relative overflow-hidden" style={{ borderRadius: "20px", background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)" }}>
                            <div className="d-flex justify-content-between align-items-start position-relative z-1">
                                <div>
                                    <h2 className="fw-bold mb-1" style={{ letterSpacing: "-1px" }}>Hello, {employee.firstName}! 👋</h2>
                                    <p className="mb-0 opacity-75">Welcome to your dashboard. Stay productive and track your progress.</p>
                                </div>
                                <div className="position-relative" ref={notifRef}>
                                    <button 
                                        className="btn btn-link text-white p-2 position-relative" 
                                        onClick={handleToggleNotifications}
                                        style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px" }}
                                    >
                                        <FaBell size={24} />
                                        {notifications.some(n => !n.isRead) && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-primary" style={{ fontSize: "0.6rem" }}>
                                                {notifications.filter(n => !n.isRead).length}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="position-absolute end-0 mt-2 shadow-2xl overflow-hidden" 
                                             style={{ 
                                                 width: "320px", 
                                                 background: "rgba(30, 41, 59, 0.98)", 
                                                 backdropFilter: "blur(20px)",
                                                 borderRadius: "20px",
                                                 border: "1px solid rgba(255,255,255,0.1)",
                                                 zIndex: 1000
                                             }}>
                                            <div className="p-3 border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center">
                                                <h6 className="mb-0 fw-bold">Recent Alerts</h6>
                                                <span className="badge bg-primary bg-opacity-20 text-primary small">{notifications.length} Total</span>
                                            </div>
                                            <div className="overflow-auto" style={{ maxHeight: "300px" }}>
                                                {notifications.length > 0 ? (
                                                    notifications.slice().reverse().map((n, i) => (
                                                        <div key={i} className={`p-3 border-bottom border-white border-opacity-5 ${!n.isRead ? 'bg-primary bg-opacity-10' : ''}`}>
                                                            <div className="small fw-bold text-white mb-1">{n.type?.replace('_', ' ') || 'SYSTEM'}</div>
                                                            <p className="extra-small text-white-50 mb-0">{n.message}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-white-50 small">No notifications yet</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks & Momentum Section */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-2xl h-100 p-4 overflow-hidden position-relative" 
                             style={{ 
                                 borderRadius: "20px",
                                 background: "rgba(30, 41, 59, 0.8)",
                                 backdropFilter: "blur(20px)",
                                 border: "1px solid rgba(59, 130, 246, 0.2)",
                                 color: "white"
                             }}>
                            {/* Decorative Glow */}
                            <div className="position-absolute top-0 end-0 bg-primary opacity-10 rounded-circle" style={{ width: "150px", height: "150px", filter: "blur(60px)", transform: "translate(30%, -30%)" }}></div>
                            
                            <div className="position-relative z-1">
                                <h6 className="fw-bold text-uppercase small text-info ls-1 mb-4">NexGen Momentum</h6>
                                
                                <div className="text-center mb-4">
                                    <div className="d-inline-flex position-relative align-items-center justify-content-center">
                                        <svg width="120" height="120" viewBox="0 0 36 36">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="3" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${stats.efficiency}, 100`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1.5s ease" }} />
                                        </svg>
                                        <div className="position-absolute text-center">
                                            <h2 className="fw-bold mb-0">{stats.efficiency}%</h2>
                                            <span className="extra-small opacity-50">Efficiency</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-2 text-center mt-2">
                                    <div className="col-6">
                                        <div className="p-2 border border-white border-opacity-10 rounded-4" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                                            <div className="h4 fw-bold text-success mb-0" style={{ textShadow: "0 0 10px rgba(25, 135, 84, 0.3)" }}>{stats.completed}</div>
                                            <div className="extra-small opacity-50 text-uppercase fw-bold ls-1" style={{ fontSize: "0.6rem" }}>Finished</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-2 border border-white border-opacity-10 rounded-4" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                                            <div className="h4 fw-bold text-warning mb-0" style={{ textShadow: "0 0 10px rgba(255, 193, 7, 0.3)" }}>{stats.pending}</div>
                                            <div className="extra-small opacity-50 text-uppercase fw-bold ls-1" style={{ fontSize: "0.6rem" }}>Pending</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`mt-4 p-3 rounded-4 border border-opacity-20 d-flex align-items-center gap-3 ${stats.pending > 0 ? 'bg-warning bg-opacity-10 border-warning' : 'bg-success bg-opacity-10 border-success'}`} style={{ transition: "0.3s" }}>
                                    <div className={`p-2 rounded-circle shadow-sm ${stats.pending > 0 ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
                                        <FaTasks size={14} />
                                    </div>
                                    <div>
                                        <div className="small fw-bold text-white">{stats.pending > 0 ? "Push Harder!" : "Clean Slate!"}</div>
                                        <div className="extra-small text-white-50">{stats.pending > 0 ? `${stats.pending} items need your attention.` : "You've crushed all assignments!"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Cards */}
                    <div className="col-lg-8">
                        <div className="row g-4">
                            {[
                                { title: "My Profile", icon: <FaUserCircle />, link: "/employee-profile", desc: "View & edit your information", color: "indigo" },
                                { title: "Attendance History", icon: <FaCalendarCheck />, link: "/attendance", desc: "View your monthly records", color: "teal" },
                                { title: "Leave Management", icon: <FaFileAlt />, link: "/leaves", desc: "Apply and track leaves", color: "orange" },
                                { title: "Daily Work Log", icon: <FaTasks />, link: "/employee-worklogs", desc: "Report your daily tasks", color: "cyan" }
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
                .ls-1 { letter-spacing: 1px; }
                .extra-small { font-size: 0.7rem; }
                .animate-pulse { animation: pulse 2s infinite; }
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
            `}</style>
        </div>
    );
}

export default EmployeeDashboard;