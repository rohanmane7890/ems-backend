import React, { useState, useEffect } from "react";
import { submitWorkLog, getEmployeeWorkLogs, getEmployeeTasks, updateTaskStatus } from "../services/EmployeeService";
import { FaTasks, FaHistory, FaCheckCircle, FaClock, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function EmployeeWorkLog() {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [employeeId, setEmployeeId] = useState(localStorage.getItem("employeeId"));
    const [formData, setFormData] = useState({
        tasksDescription: "",
        hoursWorked: "",
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (!employeeId) {
            toast.error("User not identified. Please login again.");
            navigate("/login");
            return;
        }
        fetchLogs();
        fetchTasks();
    }, [employeeId]);

    const fetchTasks = async () => {
        try {
            const res = await getEmployeeTasks(employeeId);
            setAssignedTasks(res.data);
        } catch (err) {}
    };

    const fetchLogs = async () => {
        try {
            const res = await getEmployeeWorkLogs(employeeId);
            setLogs(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching logs", error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                employeeId: parseInt(employeeId),
                taskId: selectedTaskId // 🛡️ Explicitly link to task
            };
            await submitWorkLog(payload);
            
            // 🚀 Auto-complete task if it was a mission report
            if (selectedTaskId && formData.tasksDescription.startsWith("[MISSION REPORT]")) {
                try {
                    await updateTaskStatus(selectedTaskId, 'COMPLETED');
                    toast.success("Mission Confirmed & Log Submitted!");
                } catch (err) {
                    console.error("Task auto-complete failed", err);
                }
            } else {
                toast.success("Work log submitted successfully!");
            }

            setFormData({ 
                tasksDescription: "", 
                hoursWorked: "", 
                date: new Date().toISOString().split('T')[0] 
            });
            setSelectedTaskId(null);
            fetchLogs();
            fetchTasks();
        } catch (error) {
            toast.error("Failed to submit work log");
        }
    };

    return (
        <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", minHeight: "100vh", padding: "40px 0" }}>
            <div className="container">
                <button className="btn btn-link text-decoration-none text-muted p-0 mb-4 fw-bold" onClick={() => navigate("/employee-dashboard")}>
                    <FaArrowLeft className="me-2" /> Back to Dashboard
                </button>

                <div className="row g-4">
                    {/* 🚀 Active Mission Hub */}
                    <div className="col-12 mb-4">
                        <div className="card shadow-2xl border-0 p-4 text-white" style={{ 
                            borderRadius: "24px", 
                            background: "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.05)"
                        }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold mb-0 d-flex align-items-center">
                                    <FaTasks className="me-2 text-info" /> Assigned Missions
                                </h4>
                                <span className="small opacity-50 fw-bold uppercase ls-1">Elite Dispatch Hub</span>
                            </div>
                            <div className="row g-4">
                                {assignedTasks.length > 0 ? (
                                    assignedTasks.filter(t => t.status !== 'COMPLETED').map(task => (
                                        <div key={task.id} className="col-md-6 col-xl-4">
                                            <div className="mission-card p-4 rounded-4 border border-white border-opacity-5 h-100" style={{ 
                                                background: "rgba(255, 255, 255, 0.03)", 
                                                transition: "0.3s ease-in-out",
                                                boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)" 
                                            }}>
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <h6 className="fw-bold mb-0 text-truncate text-info" style={{ fontSize: "1rem" }}>{task.title}</h6>
                                                    <div className="px-2 py-1 rounded bg-info bg-opacity-10 text-info extra-small fw-bold border border-info border-opacity-20">ACTIVE</div>
                                                </div>
                                                <p className="small opacity-75 mb-4 lh-base" style={{ fontSize: "0.8rem" }}>{task.description}</p>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-primary btn-sm flex-grow-1 fw-bold rounded-pill py-2 shadow-sm" onClick={() => {
                                                        setSelectedTaskId(task.id);
                                                        setFormData({ ...formData, tasksDescription: `[MISSION REPORT] ${task.title}: ` });
                                                        window.scrollTo({ top: 400, behavior: 'smooth' });
                                                        toast.info("Mission Mode Activated. Submit your report below.");
                                                    }}>
                                                        Send Report
                                                    </button>
                                                    <button className="btn btn-outline-success btn-sm flex-grow-1 fw-bold rounded-pill py-2" onClick={async () => {
                                                        try {
                                                            await updateTaskStatus(task.id, 'COMPLETED');
                                                            toast.success("Mission Confirmed! Status sent to Admin.");
                                                            fetchTasks();
                                                        } catch(e) { toast.error("Error confirming mission"); }
                                                    }}>
                                                        Finish Task
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 py-5 text-center opacity-50">
                                        <div className="h1 mb-2">🔭</div>
                                        <div className="small fw-bold ls-1 uppercase">No active missions dispatched yet.</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
                            <h4 className="fw-bold mb-4 d-flex align-items-center">
                                <FaTasks className="text-primary me-2" /> Daily Work Log
                            </h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Date</label>
                                    <input type="date" className="form-control" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Hours Worked</label>
                                    <input type="number" step="0.5" className="form-control" placeholder="e.g. 8.5" value={formData.hoursWorked} onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted">What did you work on?</label>
                                    <textarea className="form-control" rows="5" placeholder="Describe your tasks..." value={formData.tasksDescription} onChange={(e) => setFormData({ ...formData, tasksDescription: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm rounded-pill">
                                    Submit Work Log
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "20px" }}>
                            <h4 className="fw-bold mb-4 d-flex align-items-center">
                                <FaHistory className="text-secondary me-2" /> My Activity History
                            </h4>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Hours</th>
                                            <th>Tasks</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="4" className="text-center py-4">Loading history...</td></tr>
                                        ) : logs.length > 0 ? (
                                            logs.map((log) => (
                                                <tr key={log.id}>
                                                    <td className="fw-bold text-primary">{log.date}</td>
                                                    <td><FaClock className="me-1 text-muted" /> {log.hoursWorked} hrs</td>
                                                    <td className="small" style={{ maxWidth: "300px" }}>{log.tasksDescription}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill px-3 ${log.status === 'SUBMITTED' ? 'bg-info-subtle text-info' : 'bg-success-subtle text-success'}`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4" className="text-center py-4 text-muted">No logs submitted yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .bg-info-subtle { background-color: #e0f2fe; }
                .bg-success-subtle { background-color: #dcfce7; }
            `}</style>
        </div>
    );
}

export default EmployeeWorkLog;
