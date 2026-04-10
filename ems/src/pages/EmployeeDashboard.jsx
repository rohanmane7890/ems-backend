import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEmployeeByEmail, getAttendanceHistory, getEmployeeTasks, getSalaryHistory, createNotification } from "../services/EmployeeService";
import { 
    FaUserCircle, FaHistory, FaCalendarAlt, FaTasks, 
    FaRocket, FaClipboardList, FaWallet, FaBolt, FaCheckCircle, FaExclamationCircle, FaCommentAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

function EmployeeDashboard() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [salaryHistory, setSalaryHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showMgmtModal, setShowMgmtModal] = useState(false);
    const [mgmtMessage, setMgmtMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!mgmtMessage.trim()) return;
        setIsSending(true);
        try {
            await createNotification({
                employeeId: -1,
                message: `[EMPLOYEE MSG] ${employee.firstName}: ${mgmtMessage}`,
                type: "ADMIN_ALERT"
            });
            toast.success("Message sent to Admin!");
            setMgmtMessage("");
            setShowMgmtModal(false);
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message: " + (error.response?.data || error.message));
        } finally {
            setIsSending(false);
        }
    };

    useEffect(() => {
        const email = localStorage.getItem("loggedInEmail");
        const role = localStorage.getItem("role");
        if (!email || role !== "EMPLOYEE") {
            navigate("/login", { replace: true });
            return;
        }
        fetchData(email);
    }, [navigate]);

    const fetchData = async (email) => {
        try {
            const empRes = await getEmployeeByEmail(email);
            const empData = empRes.data;
            setEmployee(empData);

            const [attRes, taskRes, salRes] = await Promise.all([
                getAttendanceHistory(empData.id).catch(() => ({ data: [] })),
                getEmployeeTasks(empData.id).catch(() => ({ data: [] })),
                getSalaryHistory(empData.id).catch(() => ({ data: [] }))
            ]);
            
            setAttendance(attRes.data || []);
            setTasks(taskRes.data || []);
            setSalaryHistory(salRes.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Dashboard error", error);
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-black text-white">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <div className="fw-bold tracking-widest text-uppercase small">Initializing Elite Command Center...</div>
        </div>
    );

    const doneTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const pendingTasks = tasks.length - doneTasks;
    const efficiency = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

    return (
        <div style={{ background: "#020617", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#fff", padding: "40px 20px" }}>
            <div className="container" style={{ maxWidth: "1250px" }}>
                
                {/* 👋 Hello Banner (Minimized Style) */}
                <div className="hero-banner mb-4 position-relative overflow-hidden" style={{ 
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    borderRadius: "24px",
                    padding: "30px 40px",
                    boxShadow: "0 20px 40px rgba(37, 99, 235, 0.2)"
                }}>
                    <div className="position-relative z-index-10">
                        <h1 className="fw-bold mb-2 fs-2">Hello, {employee?.firstName}! 👋</h1>
                        <p className="text-white text-opacity-80 fs-6 mb-0">Welcome to your dashboard. stay productive and track your progress.</p>
                    </div>
                </div>

                <div className="row g-4">
                    {/* 🚀 NexGen Momentum (Efficiency) */}
                    <div className="col-lg-4">
                        <div className="dashboard-card p-4 h-100">
                            <div className="text-info-custom fw-bold text-uppercase mb-4" style={{ fontSize: "0.7rem", letterSpacing: "1.5px" }}>
                                NEXGEN MOMENTUM
                            </div>
                            
                            <div className="d-flex justify-content-center mb-5">
                                <div className="efficiency-wheel">
                                    <svg width="180" height="180" viewBox="0 0 160 160">
                                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                        <circle cx="80" cy="80" r="70" fill="none" stroke="url(#blueGradient)" strokeWidth="12" strokeDasharray={`${efficiency * 4.39} 439`} strokeLinecap="round" transform="rotate(-90 80 80)" style={{ filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))" }} />
                                        <defs>
                                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#60a5fa" />
                                                <stop offset="100%" stopColor="#2563eb" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                                        <div className="h2 fw-bold mb-0">{efficiency}%</div>
                                        <div className="text-white text-opacity-40 x-small-text">EFFICIENCY</div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <div className="stats-box text-center">
                                        <div className="h3 fw-bold mb-0">{doneTasks}</div>
                                        <div className="text-white text-opacity-40 x-small-text">DONE</div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="stats-box text-center">
                                        <div className="h3 fw-bold mb-0">{pendingTasks}</div>
                                        <div className="text-white text-opacity-40 x-small-text">PENDING</div>
                                    </div>
                                </div>
                            </div>

                            <div className="alert-custom d-flex align-items-center gap-3">
                                <div className="pulse-circle"></div>
                                <div>
                                    <div className="fw-bold small">Clean Slate!</div>
                                    <div className="text-white text-opacity-50 extra-small">All items crushed!</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 🎮 Mission Grid */}
                    <div className="col-lg-8">
                        <div className="row g-4 mb-4">
                            <MenuCard to="/employee-profile" icon={<FaUserCircle />} title="My Profile" subtitle="View & edit account" color="#a855f7" />
                            <MenuCard to="/attendance" icon={<FaHistory />} title="Attendance" subtitle="Check monthly records" color="#3b82f6" />
                            <MenuCard to="/employee-salary" icon={<FaWallet />} title="My Salary" subtitle="Salary & History" color="#10b981" />
                            <MenuCard to="/leaves" icon={<FaCalendarAlt />} title="Leaves" subtitle="Apply & track requests" color="#f59e0b" />
                            <MenuCard to="/employee-worklogs" icon={<FaClipboardList />} title="Daily Log" subtitle="Report mission status" color="#0ea5e9" />
                            <MenuCard 
                                onClick={() => setShowMgmtModal(true)} 
                                icon={<FaCommentAlt />} 
                                title="Message Admin" 
                                subtitle="Send alert to management" 
                                color="#f43f5e" 
                            />
                        </div>

                        {/* 📊 Recent Attendance History */}
                        <div className="dashboard-card p-4">
                            <div className="d-flex align-items-center mb-4">
                                <FaHistory className="me-2 text-info" />
                                <div className="fw-bold text-uppercase small tracking-wider">RECENT ATTENDANCE HISTORY</div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-dark table-borderless align-middle mb-0 custom-table">
                                    <thead className="text-white text-opacity-40 small">
                                        <tr>
                                            <th className="pb-3 fw-medium">Date</th>
                                            <th className="pb-3 fw-medium">Check-In</th>
                                            <th className="pb-3 fw-medium">Check-Out</th>
                                            <th className="pb-3 fw-medium text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {attendance.length > 0 ? attendance.slice(0, 4).map((att, i) => (
                                            <tr key={i} className="border-top border-white border-opacity-5">
                                                <td className="py-3">{att.date}</td>
                                                <td className="py-3">{att.checkIn || '--:--'}</td>
                                                <td className="py-3">{att.checkOut || '--:--'}</td>
                                                <td className="py-3 text-center">
                                                    <span className={`status-pill ${att.status?.toLowerCase() === 'present' ? 'status-present' : 'status-absent'}`}>
                                                        {att.status || 'N/A'}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="4" className="text-center py-4 text-white text-opacity-30">No records found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-card {
                  background: #0f172a;
                  border: 1px solid rgba(255, 255, 255, 0.05);
                  border-radius: 20px;
                  transition: all 0.3s ease;
                }
                .dashboard-card:hover {
                  border-color: rgba(37, 99, 235, 0.2);
                  transform: translateY(-4px);
                }
                .menu-card {
                  text-decoration: none;
                  padding: 24px;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  text-align: center;
                }
                .efficiency-wheel {
                    position: relative;
                    display: inline-block;
                }
                .stats-box {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 15px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .alert-custom {
                    background: rgba(37, 99, 235, 0.1);
                    border: 1px solid rgba(37, 99, 235, 0.2);
                    padding: 15px;
                    border-radius: 12px;
                }
                .pulse-circle {
                    width: 12px;
                    height: 12px;
                    background: #3b82f6;
                    border-radius: 50%;
                    box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                .status-pill {
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .status-present { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .status-absent { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                .text-info-custom { color: #60a5fa; }
                .x-small-text { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.5px; }
                .extra-small { font-size: 0.75rem; }
                .border-dashed { border-style: dashed !important; border-width: 2px !important; }
                .opacity-40 { opacity: 0.4; }
                .custom-table { --bs-table-bg: transparent; }
                .tracking-wider { letter-spacing: 1px; }
            `}</style>
            {/* 🛡️ Management Message Modal */}
            <AnimatePresence>
                {showMgmtModal && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-4" style={{ zIndex: 1100, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="dashboard-card p-5" 
                            style={{ maxWidth: "500px", width: "100%", border: "1px solid rgba(255,255,255,0.1)", background: "#1e293b", borderRadius: "24px" }}
                        >
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 rounded-circle bg-danger bg-opacity-20 text-danger fs-4">
                                    <FaCommentAlt />
                                </div>
                                <div>
                                    <h4 className="fw-bold text-white mb-0">Message Admin</h4>
                                    <p className="text-white-50 small mb-0">System Management Alert</p>
                                </div>
                            </div>
                            
                            <p className="text-white-50 small mb-4">Your message will be sent directly to the administrator's notification center. Use this for urgent reports or support requests.</p>
                            
                            <form onSubmit={handleSendMessage}>
                                <div className="mb-4">
                                    <textarea 
                                        className="form-control bg-dark bg-opacity-50 text-white border-white border-opacity-10 p-3 rounded-4"
                                        style={{ minHeight: "120px", resize: "none" }}
                                        placeholder="Type your message here..."
                                        value={mgmtMessage}
                                        onChange={(e) => setMgmtMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-outline-light rounded-pill px-4" onClick={() => setShowMgmtModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary-gradient rounded-pill px-4 flex-grow-1 fw-bold" disabled={isSending}>
                                        {isSending ? "Sending Alert..." : "Send to Management"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MenuCard({ to, icon, title, subtitle, color, onClick }) {
    const Component = onClick ? 'div' : Link;
    const props = onClick ? { onClick, style: { cursor: 'pointer' } } : { to };

    return (
        <div className="col-md-4 col-sm-6">
            <Component {...props} className="dashboard-card menu-card">
                <div className="fs-2 mb-3" style={{ color: color }}>{icon}</div>
                <div className="fw-bold text-white small mb-1">{title}</div>
                <div className="text-white text-opacity-40 extra-small">{subtitle}</div>
            </Component>
        </div>
    );
}

export default EmployeeDashboard;