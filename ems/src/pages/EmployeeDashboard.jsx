import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEmployeeByEmail, getAttendanceHistory, getEmployeeTasks, getSalaryHistory } from "../services/EmployeeService";
import { 
    FaUserCircle, FaHistory, FaCalendarAlt, FaTasks, 
    FaRocket, FaClipboardList, FaMoneyBillWave
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
            navigate("/login");
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

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100 bg-black text-white">Loading NexGen Elite...</div>;

    const doneTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const pendingTasks = tasks.length - doneTasks;
    const efficiency = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

    return (
        <div style={{ background: "#060b18", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#fff", padding: "25px 20px" }}>
            <div className="container" style={{ maxWidth: "1200px" }}>
                
                {/* 👋 Hello Banner (Smaller & Compact) */}
                <div className="p-4 mb-4" style={{ background: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ fontSize: "1.75rem" }}>Hello, {employee?.firstName}! 👋</h2>
                            <p className="opacity-75 mb-0 small">Welcome to your dashboard. stay productive and track your progress.</p>
                        </div>
                    </div>
                </div>

                <div className="row g-3">
                    {/* 🚀 NexGen Momentum Card (Minimized) */}
                    <div className="col-lg-4">
                        <div className="card h-100 shadow-lg border-0 p-3" style={{ borderRadius: "20px", background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                            <div className="text-info fw-bold text-uppercase mb-3" style={{ fontSize: "0.7rem", letterSpacing: "1.5px" }}>NEXGEN MOMENTUM</div>
                            
                            <div className="text-center py-2 mb-3 position-relative">
                                <div className="mx-auto" style={{ width: "110px", height: "110px", position: "relative" }}>
                                    <svg width="110" height="110" viewBox="0 0 160 160">
                                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />
                                        <circle cx="80" cy="80" r="70" fill="none" stroke="#2563eb" strokeWidth="18" strokeDasharray={`${efficiency * 4.39} 439`} strokeLinecap="round" transform="rotate(-90 80 80)" style={{ filter: "drop-shadow(0 0 8px #2563eb)" }} />
                                    </svg>
                                    <div className="position-absolute top-50 start-50 translate-middle">
                                        <div className="h3 fw-bold mb-0 text-white">{efficiency}%</div>
                                        <div className="extra-small opacity-50 uppercase fw-bold" style={{ fontSize: "0.55rem" }}>Efficiency</div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-2 mb-3">
                                <div className="col-6">
                                    <div className="bg-white rounded-3 p-2 text-dark text-center shadow-sm">
                                        <div className="h4 fw-bold mb-0">{doneTasks}</div>
                                        <div className="extra-small opacity-50 uppercase" style={{ fontSize: "0.5rem" }}>Done</div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bg-white rounded-3 p-2 text-dark text-center shadow-sm">
                                        <div className="h4 fw-bold mb-0">{pendingTasks}</div>
                                        <div className="extra-small opacity-50 uppercase" style={{ fontSize: "0.5rem" }}>Pending</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 d-flex align-items-center gap-3 mt-auto" style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                <div className="rounded-circle bg-primary shadow-lg" style={{ width: "30px", height: "30px", boxShadow: "0 0 15px rgba(37, 99, 235, 0.4)" }}></div>
                                <div>
                                    <div className="fw-bold text-white" style={{ fontSize: "0.85rem" }}>Clean Slate!</div>
                                    <div className="extra-small text-white-50" style={{ fontSize: "0.65rem" }}>{pendingTasks === 0 ? "All items crushed!" : `${pendingTasks} items remaining.`}</div>
                                </div>
                            </div>
                            
                            {/* Latest Salary Badge */}
                            {salaryHistory.length > 0 && (
                                <div className="p-3 d-flex align-items-center gap-3 mt-3 animate-pulse" style={{ background: "rgba(16, 185, 129, 0.1)", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                                    <div className="text-success"><FaMoneyBillWave /></div>
                                    <div>
                                        <div className="extra-small text-success fw-bold uppercase" style={{ fontSize: "0.55rem" }}>Latest Disbursement</div>
                                        <div className="fw-bold text-white" style={{ fontSize: "0.8rem" }}>{salaryHistory.sort((a,b) => new Date(b.transactionDate) - new Date(a.transactionDate))[0].paymentMonth} Paid</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 🎮 Grid Cards Navigation (Minimized) */}
                    <div className="col-lg-8">
                        <div className="row g-3 h-100">
                            <MenuCard to="/employee-profile" icon={<FaUserCircle className="text-purple" />} title="My Profile" desc="View & edit account" />
                            <MenuCard to="/attendance" icon={<FaHistory className="text-teal" />} title="Attendance" desc="Check monthly records" />
                            <MenuCard to="/employee-salary" icon={<FaMoneyBillWave className="text-success" />} title="My Salary" desc="Salary & History" />
                            <MenuCard to="/leaves" icon={<FaCalendarAlt className="text-warning" />} title="Leaves" desc="Apply & track requests" />
                            <MenuCard to="/employee-worklogs" icon={<FaClipboardList className="text-info" />} title="Daily Log" desc="Report mission status" />
                        </div>
                    </div>

                    {/* 📊 Recent Attendance History */}
                    <div className="col-12 mt-3">
                        <div className="card shadow-lg border-0 p-3" style={{ borderRadius: "20px", background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <div className="d-flex align-items-center mb-3 text-info fw-bold text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "1.5px" }}>
                                <FaHistory className="me-2" /> RECENT ATTENDANCE HISTORY
                            </div>
                            <div className="table-responsive rounded-3">
                                <table className="table table-borderless align-middle mb-0" style={{ background: "#fff", borderRadius: "12px" }}>
                                    <thead className="bg-white border-bottom text-dark" style={{ fontSize: "0.75rem", fontWeight: "700" }}>
                                        <tr>
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3">Check-In</th>
                                            <th className="py-3">Check-Out</th>
                                            <th className="py-3 px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: "0.85rem" }}>
                                        {attendance.length > 0 ? attendance.slice(-4).reverse().map((att, i) => (
                                            <tr key={i} className="bg-white border-bottom border-light">
                                                <td className="fw-bold px-4 py-4 text-dark">{att.date}</td>
                                                <td className="fw-bold text-dark">{att.checkIn || '--:--'}</td>
                                                <td className="fw-bold text-dark">{att.checkOut || '--:--'}</td>
                                                <td className="px-4">
                                                    <div style={{ 
                                                        display: "inline-block",
                                                        padding: "4px 12px",
                                                        background: att.status?.toLowerCase() === 'present' ? "#10b981" : "#ef4444", 
                                                        color: "#fff",
                                                        borderRadius: "20px",
                                                        fontSize: "0.65rem",
                                                        fontWeight: "800",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.5px",
                                                        boxShadow: `0 4px 10px ${att.status?.toLowerCase() === 'present' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                                                    }}>
                                                        {att.status || 'N/A'}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : <tr><td colSpan="4" className="text-center py-5 text-muted">No recent work history recorded.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <style>{`
                .text-purple { color: #a855f7; }
                .text-teal { color: #2dd4bf; }
                .text-warning { color: #f59e0b; }
                .text-info { color: #0ea5e9; }
                .card:hover { transform: translateY(-3px); transition: 0.2s ease-in-out; }
                .extra-small { font-size: 0.65rem; }
                .uppercase { text-transform: uppercase; }
                .container { max-width: 1100px !important; }
                .animate-pulse { animation: pulse-border 2s infinite; }
                @keyframes pulse-border {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
            `}</style>
        </div>
    );
}

function MenuCard({ to, icon, title, desc }) {
    return (
        <div className="col-md-4 col-sm-6">
            <Link to={to} className="card h-100 shadow-lg border-0 p-3 text-center text-decoration-none" style={{ borderRadius: "20px", background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div className="fs-2 mb-2">{icon}</div>
                <div className="fw-bold text-white h6 mb-1">{title}</div>
                <div className="extra-small text-white-50">{desc}</div>
            </Link>
        </div>
    );
}

export default EmployeeDashboard;