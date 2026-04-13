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
    const [selectedLog, setSelectedLog] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
            const allTasks = tasksRes.data;
            const logEntries = logsRes.data;

            const processedLogs = logEntries.map(log => {
                // Check for formal Task ID link
                if (log.taskId) {
                    const matchingTask = allTasks.find(t => t.id === log.taskId);
                    if (matchingTask) {
                        matchingTask.isLinked = true;
                        return {
                            ...log,
                            type: 'MISSION_SYNC',
                            missionTitle: matchingTask.title,
                            missionDescription: matchingTask.description,
                            missionDueDate: matchingTask.dueDate,
                            employeeResponse: log.tasksDescription.replace(/\[MISSION REPORT\] .*?: /, "").trim()
                        };
                    }
                }

                // Fallback for older string-prefix logs
                const missionPrefix = "[MISSION REPORT] ";
                if (log.tasksDescription.startsWith(missionPrefix)) {
                    const rest = log.tasksDescription.substring(missionPrefix.length);
                    const titlePart = rest.split(":")[0];
                    const matchingTask = allTasks.find(t => t.title === titlePart && t.employeeEmail === log.employeeEmail);
                    
                    if (matchingTask) {
                        matchingTask.isLinked = true;
                        return {
                            ...log,
                            type: 'MISSION_SYNC',
                            missionTitle: matchingTask.title,
                            missionDescription: matchingTask.description,
                            missionDueDate: matchingTask.dueDate,
                            employeeResponse: rest.substring(titlePart.length + 2).trim()
                        };
                    }
                }
                return { ...log, type: 'MANUAL' };
            });

            // Add standalone completed tasks that don't have a linked manual report
            const standaloneTasks = allTasks.filter(t => t.status === 'COMPLETED' && !t.isLinked).map(t => ({
                id: `T${t.id}`,
                employeeName: t.employeeName,
                employeeEmail: t.employeeEmail,
                date: t.dueDate || "N/A",
                hoursWorked: "Task Complete",
                tasksDescription: t.title + ": " + t.description,
                type: 'ASSIGNED',
                isStandaloneTask: true
            }));
            
            setAllLogs([...processedLogs, ...standaloneTasks].sort((a, b) => new Date(b.date) - new Date(a.date)));
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
                                                        <span className={`badge ${log.type === 'MISSION_SYNC' ? 'bg-success' : 'bg-info'} bg-opacity-10 ${log.type === 'MISSION_SYNC' ? 'text-success' : 'text-info'} border ${log.type === 'MISSION_SYNC' ? 'border-success' : 'border-info'} border-opacity-25 px-3 py-2 rounded-pill fw-bold`} style={{ fontSize: "0.7rem" }}>
                                                            {log.type === 'MISSION_SYNC' ? '🚀 MISSION COMPLETE' : log.date}
                                                        </span>
                                                    </div>
                                                </div>

                                                {log.type === 'MISSION_SYNC' ? (
                                                    <div className="mission-qa-container">
                                                        {/* Section 1: The Question (Assignment) */}
                                                        <div className="rounded-4 p-3 mb-2" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                                            <div className="text-white-50 extra-small fw-bold text-uppercase ls-1 mb-2">1. System Assignment (Question)</div>
                                                            <div className="text-info fw-bold small mb-1">{log.missionTitle}</div>
                                                            <div className="text-white-50 extra-small opacity-75">{log.missionDescription}</div>
                                                        </div>

                                                        {/* Section 2: The Answer (Response) */}
                                                        <div className="rounded-4 p-3 mb-3" style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                                                            <div className="text-success extra-small fw-bold text-uppercase ls-1 mb-2 d-flex justify-content-between">
                                                                <span>2. Employee Response (Answer)</span>
                                                                <span>{log.hoursWorked} hrs</span>
                                                            </div>
                                                            <p className="text-white small mb-0 fw-medium">{log.employeeResponse || "No detailed logs provided."}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="rounded-4 p-3 mb-3 border border-white border-opacity-5" style={{ background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                                        <div className="text-info small text-uppercase fw-bold ls-1 mb-2" style={{ fontSize: "0.6rem" }}>
                                                            Tasks Completed
                                                        </div>
                                                        <p className="text-white small mb-0 fw-bold opacity-75" style={{ lineHeight: "1.6", letterSpacing: "0.5px" }}>{log.tasksDescription || "No detailed logs provided."}</p>
                                                    </div>
                                                )}

                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill" style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                                                        <FaTasks className="text-success shadow-sm" style={{ fontSize: "0.8rem" }} /> 
                                                        <span className="text-white fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                                                            {log.type === 'MISSION_SYNC' ? 'MISSION STATUS: VERIFIED' : log.hoursWorked}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        className="btn btn-sm btn-link text-info text-decoration-none p-0 fw-bold"
                                                        onClick={() => { setSelectedLog(log); setShowModal(true); }}
                                                    >
                                                        Review Full Audit →
                                                    </button>
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

            {/* 🛡️ Premium Audit Modal */}
            <AnimatePresence>
                {showModal && selectedLog && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1100, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card border-0 shadow-2xl mx-3" 
                            style={{ borderRadius: "24px", background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255, 255, 255, 0.1)", maxWidth: "600px", width: "100%" }}
                        >
                            <div className="card-body p-5">
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div>
                                        <h3 className="fw-bold text-white mb-1" style={{ letterSpacing: "-1px" }}>Work Audit Details</h3>
                                        <div className="text-info small fw-bold text-uppercase ls-1">Verified Portal History</div>
                                    </div>
                                    <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                </div>

                                <div className="p-4 rounded-4 mb-4" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <div className="extra-small text-white-50 text-uppercase fw-bold mb-1">Employee</div>
                                            <div className="text-white fw-bold">{selectedLog.employeeName}</div>
                                        </div>
                                        <div className="col-6">
                                            <div className="extra-small text-white-50 text-uppercase fw-bold mb-1">Reporting Date</div>
                                            <div className="text-white fw-bold">{selectedLog.date}</div>
                                        </div>
                                        <div className="col-12 border-top border-white border-opacity-5 pt-3">
                                            <div className="extra-small text-white-50 text-uppercase fw-bold mb-2">Detailed Work Record</div>
                                            {selectedLog.type === 'MISSION_SYNC' ? (
                                                <div className="p-3 rounded-4 mb-2" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                                    <div className="text-info extra-small fw-bold text-uppercase mb-2">Original Assignment</div>
                                                    <div className="text-white small mb-3 opacity-75">{selectedLog.missionTitle}: {selectedLog.missionDescription}</div>
                                                    
                                                    <div className="text-success extra-small fw-bold text-uppercase mb-2">Employee Response</div>
                                                    <div className="text-white small lh-lg fw-medium">{selectedLog.employeeResponse}</div>
                                                </div>
                                            ) : (
                                                <div className="text-white small lh-lg fw-medium">{selectedLog.tasksDescription}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="badge bg-success bg-opacity-20 text-success rounded-pill px-3 py-2 fw-bold" style={{ fontSize: "0.8rem" }}>
                                        <FaTasks className="me-2" /> {selectedLog.hoursWorked}
                                    </div>
                                    <button className="btn btn-info rounded-pill px-4 fw-bold" onClick={() => setShowModal(false)}>Close Audit</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <style>{`
                .ls-1 { letter-spacing: 1.5px; }
            `}</style>
        </div>
    );
}

export default AdminWorkLogView;
