import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEmployeeByEmail, getAttendanceHistory, getEmployeeTasks, getSalaryHistory } from "../services/EmployeeService";
import { 
    FaUserCircle, FaHistory, FaCalendarAlt, FaTasks, 
    FaRocket, FaClipboardList, FaWallet, FaBolt, FaCheckCircle, FaExclamationCircle
} from "react-icons/fa";
import { toast } from "react-toastify";

function EmployeeDashboard() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [salaryHistory, setSalaryHistory] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#fff", padding: "40px 20px" }}>
            <div className="container" style={{ maxWidth: "1250px" }}>
                
                {/* 👋 Hello Banner (Elite Style) */}
                <div className="elite-glass-card p-5 mb-5 overflow-hidden position-relative">
                    <div className="position-absolute top-0 end-0 p-5 opacity-10">
                        <FaRocket size={120} />
                    </div>
                    <div className="d-flex justify-content-between align-items-center position-relative z-index-10">
                        <div>
                            <div className="bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-1 small fw-bold mb-3 d-inline-block">
                                <FaBolt className="me-2" /> OPERATIONAL STATUS: ONLINE
                            </div>
                            <h1 className="fw-bold mb-2 tracking-tighter" style={{ fontSize: "3rem" }}>Welcome, {employee?.firstName}.</h1>
                            <p className="text-white-50 fs-5 mb-0">System diagnostic complete. You are operating at <span className="text-primary fw-bold">{efficiency}% efficiency</span> today.</p>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* 🚀 Neural Pulse Efficiency Card */}
                    <div className="col-lg-4">
                        <div className="elite-glass-card p-4 h-100 d-flex flex-column">
                            <div className="text-info fw-bold text-uppercase mb-4 d-flex justify-content-between align-items-center" style={{ fontSize: "0.75rem", letterSpacing: "2px" }}>
                                <span>NEURAL PULSE</span>
                                <span className="text-success small">PEAK</span>
                            </div>
                            
                            <div className="text-center py-4 mb-4 position-relative flex-grow-1 d-flex align-items-center justify-content-center">
                                <div className="pulse-ring-container">
                                    <svg width="180" height="180" viewBox="0 0 160 160">
                                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                                        <circle cx="80" cy="80" r="70" fill="none" stroke="url(#neuralGradient)" strokeWidth="12" strokeDasharray={`${efficiency * 4.39} 439`} strokeLinecap="round" transform="rotate(-90 80 80)" style={{ filter: "drop-shadow(0 0 12px rgba(37, 99, 235, 0.5))", transition: "stroke-dasharray 1s ease-out" }} />
                                        <defs>
                                            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#60a5fa" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="position-absolute top-50 start-50 translate-middle">
                                        <div className="h1 fw-bold mb-0 text-white tracking-widest" style={{ fontSize: "2.5rem" }}>{efficiency}<span className="fs-5 opacity-50">%</span></div>
                                        <div className="extra-small text-info fw-bold tracking-widest text-uppercase" style={{ fontSize: "0.6rem" }}>Efficiency</div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <div className="bg-white bg-opacity-5 rounded-4 p-3 border border-white border-opacity-5 text-center">
                                        <div className="h4 fw-bold mb-0 text-success">{doneTasks}</div>
                                        <div className="extra-small opacity-50 uppercase fw-bold" style={{ fontSize: "0.6rem" }}>RESOLVED</div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bg-white bg-opacity-5 rounded-4 p-3 border border-white border-opacity-5 text-center">
                                        <div className="h4 fw-bold mb-0 text-warning">{pendingTasks}</div>
                                        <div className="extra-small opacity-50 uppercase fw-bold" style={{ fontSize: "0.6rem" }}>IN QUEUE</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-4 d-flex align-items-center gap-3">
                                <div className="pulse-dot"></div>
                                <div>
                                    <div className="fw-bold text-white small">NexGen AI Status Briefing</div>
                                    <div className="text-white-50 extra-small mt-1">
                                        {pendingTasks === 0 ? "Strategic objectives met. You are currently the top performer." : `Priority Alert: ${pendingTasks} tactical missions awaiting execution.`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 🎮 Strategic Mission Control Grid */}
                    <div className="col-lg-8">
                        <div className="row g-4 mb-4">
                            <MenuCard to="/employee-profile" icon={<FaUserCircle />} title="Profile Interface" color="#a855f7" />
                            <MenuCard to="/attendance" icon={<FaHistory />} title="Chronos Logs" color="#2dd4bf" />
                            <MenuCard to="/employee-salary" icon={<FaWallet />} title="Payroll Suite" color="#10b981" />
                            <MenuCard to="/leaves" icon={<FaCalendarAlt />} title="Leave Protocol" color="#f59e0b" />
                            <MenuCard to="/employee-worklogs" icon={<FaClipboardList />} title="Mission Reports" color="#0ea5e9" />
                            <div className="col-md-4">
                                <div className="elite-glass-card p-4 h-100 d-flex flex-column justify-content-center align-items-center opacity-50 grayscale border-dashed">
                                    <FaRocket className="fs-2 mb-2" />
                                    <div className="fw-bold small text-uppercase">Coming Soon</div>
                                </div>
                            </div>
                        </div>

                        {/* 📊 Intelligence Log (Recent History) */}
                        <div className="elite-glass-card p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div className="text-info fw-bold text-uppercase d-flex align-items-center" style={{ fontSize: "0.75rem", letterSpacing: "2px" }}>
                                    <FaHistory className="me-2 text-warning" /> INTELLIGENCE LOG
                                </div>
                                <Link to="/attendance" className="btn btn-link btn-sm text-white-50 text-decoration-none hover-white">View Full History</Link>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-borderless align-middle mb-0 text-white">
                                    <thead className="border-bottom border-white border-opacity-10 opacity-50" style={{ fontSize: "0.75rem" }}>
                                        <tr>
                                            <th className="pb-3 text-uppercase fw-bold">Timestamp</th>
                                            <th className="pb-3 text-uppercase fw-bold">Deployment</th>
                                            <th className="pb-3 text-uppercase fw-bold">Extraction</th>
                                            <th className="pb-3 text-uppercase fw-bold text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: "0.9rem" }}>
                                        {attendance.length > 0 ? attendance.slice(-4).reverse().map((att, i) => (
                                            <tr key={i} className="border-bottom border-white border-opacity-5">
                                                <td className="py-4 fw-bold">{att.date}</td>
                                                <td className="py-4 text-primary">{att.checkIn || '--:--'}</td>
                                                <td className="py-4 text-info">{att.checkOut || '--:--'}</td>
                                                <td className="py-4 text-center">
                                                    <span className={`badge rounded-pill px-3 py-2 ${att.status?.toLowerCase() === 'present' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`} style={{ border: "1px solid currentColor", fontSize: "0.65rem", fontWeight: "700" }}>
                                                        {att.status?.toUpperCase() || 'OFFLINE'}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="4" className="text-center py-5 text-white-50">No strategic data found. Submit your mission log today.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .elite-glass-card {
                  background: rgba(15, 23, 42, 0.7) !important;
                  backdrop-filter: blur(20px);
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  border-radius: 24px;
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .elite-glass-card:hover {
                  border-color: rgba(255, 255, 255, 0.15);
                  background: rgba(15, 23, 42, 0.8) !important;
                  transform: translateY(-5px);
                }
                .menu-card-elite {
                  text-decoration: none;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 30px 20px;
                  height: 100%;
                }
                .pulse-ring-container {
                    position: relative;
                    padding: 10px;
                }
                .pulse-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #3b82f6;
                    box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
                    animation: pulse-dot 2s infinite;
                }
                @keyframes pulse-dot {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                .tracking-tighter { letter-spacing: -2px; }
                .tracking-widest { letter-spacing: 3px; }
                .extra-small { font-size: 0.65rem; }
                .z-index-10 { z-index: 10; }
                .grayscale { filter: grayscale(1); }
                .border-dashed { border-style: dashed !important; }
            `}</style>
        </div>
    );
}

function MenuCard({ to, icon, title, color }) {
    return (
        <div className="col-md-4 col-sm-6">
            <Link to={to} className="elite-glass-card menu-card-elite">
                <div className="fs-1 mb-3" style={{ color: color, filter: `drop-shadow(0 0 10px ${color}44)` }}>{icon}</div>
                <div className="fw-bold text-white small text-uppercase tracking-widest">{title}</div>
            </Link>
        </div>
    );
}

export default EmployeeDashboard;