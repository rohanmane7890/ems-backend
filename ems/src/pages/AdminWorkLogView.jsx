import React, { useState, useEffect } from "react";
import { getAllWorkLogs, getAllTasks, getAttendanceByDate } from "../services/EmployeeService";
import { FaTasks, FaRegCalendarAlt, FaFilter, FaArrowLeft, FaFileExport, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function AdminWorkLogView() {
    const navigate = useNavigate();
    const [allLogs, setAllLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [attendanceMap, setAttendanceMap] = useState({}); // { "date": { "email": "status" } }

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        if (selectedDate) fetchAttendanceForDate(selectedDate);
    }, [selectedDate]);

    const fetchAttendanceForDate = async (date) => {
        try {
            const res = await getAttendanceByDate(date);
            const map = res.data.reduce((acc, curr) => {
                acc[curr.employeeEmail] = curr.status;
                return acc;
            }, {});
            setAttendanceMap(prev => ({ ...prev, [date]: map }));
        } catch {}
    };

    useEffect(() => {
        let filtered = allLogs.filter(log => {
            const matchesSearch = log.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 log.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDate = selectedDate ? log.date === selectedDate : true;
            return matchesSearch && matchesDate;
        });
        setFilteredLogs(filtered);
    }, [searchTerm, selectedDate, allLogs]);

    const fetchLogs = async () => {
        try {
            const [logsRes, tasksRes] = await Promise.all([getAllWorkLogs(), getAllTasks()]);
            const logs = logsRes.data.map(l => ({ ...l, type: 'MANUAL' }));
            const completedTasks = tasksRes.data.filter(t => t.status === 'COMPLETED').map(t => ({
                id: `T${t.id}`,
                employeeName: t.employeeName,
                employeeEmail: t.employeeEmail,
                date: t.dueDate || "N/A",
                hoursWorked: "Task Complete",
                tasksDescription: t.title + ": " + t.description,
                type: 'ASSIGNED'
            }));
            
            setAllLogs([...logs, ...completedTasks].sort((a, b) => new Date(b.date) - new Date(a.date)));
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch reports");
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", minHeight: "100vh", padding: "40px 0" }}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <button className="btn btn-link text-decoration-none text-white-50 p-0 mb-2 fw-bold" onClick={() => navigate("/admin-dashboard")}>
                            <FaArrowLeft className="me-2" /> Back to Dashboard
                        </button>
                        <h2 className="fw-bold text-white mb-0" style={{ letterSpacing: "-1px" }}>Employee Work Reports</h2>
                    </div>
                    <button className="btn btn-outline-info rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center">
                        <FaFileExport className="me-2" /> Export to CSV
                    </button>
                </div>

                <div className="card border-0 shadow-2xl mb-5" style={{ borderRadius: "20px", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}>
                    <div className="card-body p-4">
                        <div className="row g-3 align-items-center">
                            <div className="col-lg-5">
                                <div className="input-group bg-light rounded-pill px-3">
                                    <span className="input-group-text bg-transparent border-0"><FaUsers className="text-muted" /></span>
                                    <input 
                                        type="text" 
                                        className="form-control bg-transparent border-0 py-2" 
                                        placeholder="Filter by name or email..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="input-group bg-light rounded-pill px-3">
                                    <span className="input-group-text bg-transparent border-0"><FaRegCalendarAlt className="text-muted" /></span>
                                    <input 
                                        type="date" 
                                        className="form-control bg-transparent border-0 py-2" 
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3 text-end">
                                <span className="small text-muted fw-bold">Showing {filteredLogs.length} reports</span>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-info"></div></div>
                ) : (
                    <div className="row g-4">
                        <AnimatePresence>
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <motion.div 
                                        key={log.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="col-lg-6"
                                    >
                                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "20px", overflow: "hidden", background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <h5 className="fw-bold text-white mb-0">{log.employeeName}</h5>
                                                        <span className="text-info small opacity-75">{log.employeeEmail}</span>
                                                    </div>
                                                    <div className="d-flex flex-column align-items-end gap-2">
                                                        <span className={`badge ${log.type === 'ASSIGNED' ? 'bg-success' : 'bg-info'} bg-opacity-10 ${log.type === 'ASSIGNED' ? 'text-success' : 'text-info'} border ${log.type === 'ASSIGNED' ? 'border-success' : 'border-info'} border-opacity-25 px-3 py-2 rounded-pill fw-bold`} style={{ fontSize: "0.7rem" }}>
                                                            {log.type === 'ASSIGNED' ? '✅ COMPLETED TASK' : log.date}
                                                        </span>
                                                        {attendanceMap[log.date] && attendanceMap[log.date][log.employeeEmail] === 'ABSENT' && (
                                                            <span className="badge bg-warning bg-opacity-75 text-dark fw-bold px-3 py-1 rounded-pill" style={{ fontSize: "0.6rem" }}>
                                                                📦 REMOTE/EXTRA EFFORT
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="bg-white bg-opacity-5 rounded-4 p-3 mb-3 border border-white border-opacity-5">
                                                    <div className="text-white-50 small text-uppercase fw-bold mb-2 ls-1" style={{ fontSize: "0.6rem" }}>Tasks Completed</div>
                                                    <p className="text-white small mb-0 fw-medium" style={{ lineHeight: "1.6" }}>{log.tasksDescription}</p>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="badge bg-success bg-opacity-20 text-success rounded-pill px-3 py-1 fw-bold" style={{ fontSize: "0.75rem" }}>
                                                        <FaTasks className="me-1" /> {log.hoursWorked} working hours
                                                    </div>
                                                    <button className="btn btn-sm btn-link text-info text-decoration-none p-0 fw-bold">Review Report →</button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5 text-white-50">
                                    <h4 className="fw-bold">No work reports found matching filters.</h4>
                                    <button className="btn btn-link text-info" onClick={() => { setSearchTerm(""); setSelectedDate(""); }}>Clear Filters</button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            <style>{`
                .ls-1 { letter-spacing: 1.5px; }
            `}</style>
        </div>
    );
}

export default AdminWorkLogView;
