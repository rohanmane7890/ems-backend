import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaClock, FaHistory, FaArrowLeft, FaShieldAlt, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getEmployeeByEmail, getAttendanceHistory } from "../services/EmployeeService";

const EmployeeAttendance = () => {
    const navigate = useNavigate();
    const [attendanceRecord, setAttendanceRecord] = useState([]);
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const email = localStorage.getItem("loggedInEmail");

    useEffect(() => {
        if (!email) {
            navigate("/login");
            return;
        }
        fetchData();
    }, [navigate, email]);

    const fetchData = async () => {
        try {
            // Use Secure Services with Auth Headers
            const empRes = await getEmployeeByEmail(email);
            const empData = empRes.data;
            setEmployee(empData);

            const attRes = await getAttendanceHistory(empData.id);
            const data = Array.isArray(attRes.data) ? attRes.data : [];
            setAttendanceRecord(data);
            setLoading(false);
        } catch (error) {
            console.error("Attendance fetch error", error);
            setLoading(false);
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(attendanceRecord);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        XLSX.writeFile(workbook, `Attendance_Report_${employee?.firstName}.xlsx`);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Attendance Report", 14, 15);
        const tableData = attendanceRecord.map(rec => [rec.date, rec.checkIn, rec.checkOut, rec.status]);
        doc.autoTable({
            startY: 20,
            head: [['Date', 'Check-In', 'Check-Out', 'Status']],
            body: tableData,
        });
        doc.save(`Attendance_Report_${employee?.firstName}.pdf`);
    };

    // Helper to get record for a specific date
    const getRecordForDate = (date) => {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return attendanceRecord.find(rec => rec.date === dateStr);
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const record = getRecordForDate(date);
            if (record) {
                return (
                    <div style={{ 
                        marginTop: '4px',
                        width: '6px', 
                        height: '6px', 
                        background: record.status?.toLowerCase() === 'present' ? '#10b981' : '#ef4444', 
                        borderRadius: '50%',
                        marginInline: 'auto'
                    }} />
                );
            }
        }
        return null;
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100 bg-black text-white">Loading Pulse Vault...</div>;

    return (
        <div style={{ background: "#060b18", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#fff", padding: "40px 20px" }}>
            <div className="container" style={{ maxWidth: "1250px" }}>
                
                {/* 🛡️ Header & Navigation */}
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <button 
                            className="btn btn-link text-info p-0 mb-3 text-decoration-none d-flex align-items-center fw-bold small"
                            onClick={() => navigate("/employee-dashboard")}
                            style={{ letterSpacing: "1.5px", textTransform: "uppercase" }}
                        >
                            <FaArrowLeft className="me-2" /> Back
                        </button>
                        <h1 className="fw-bold mb-1" style={{ fontSize: "2.5rem", letterSpacing: "-1px" }}>Attendance Vault</h1>
                        <p className="opacity-50 small mb-0"><FaShieldAlt className="me-2 text-info" /> OFFICIAL RECORD HISTORY • VERIFIED TRACE</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button onClick={handleExportExcel} className="btn py-2 px-4 d-flex align-items-center gap-2" style={{ background: "#10b981", color: "#fff", borderRadius: "10px", border: "none", fontWeight: "700" }}>
                            <FaFileExcel /> Excel
                        </button>
                        <button onClick={handleExportPDF} className="btn py-2 px-4 d-flex align-items-center gap-2" style={{ background: "#ef4444", color: "#fff", borderRadius: "10px", border: "none", fontWeight: "700" }}>
                            <FaFilePdf /> PDF
                        </button>
                    </div>
                </div>

                <div className="row g-4">
                    {/* 🗓️ Left Pane: Calendar */}
                    <div className="col-lg-5">
                        <div className="card h-100 shadow-lg border-0 p-4" style={{ borderRadius: "24px", background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <h5 className="fw-bold text-info text-uppercase mb-4" style={{ fontSize: "0.85rem", letterSpacing: "2px" }}>Attendance Calendar</h5>
                            <div className="calendar-container custom-calendar">
                                <Calendar 
                                    onChange={setSelectedDate} 
                                    value={selectedDate}
                                    tileContent={tileContent}
                                    className="border-0 shadow-none w-100"
                                />
                            </div>
                            <div className="mt-4 pt-3 border-top border-white border-opacity-5 d-flex gap-4">
                                <div className="d-flex align-items-center gap-2 small opacity-75">
                                    <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%' }}></div> Present
                                </div>
                                <div className="d-flex align-items-center gap-2 small opacity-75">
                                    <div style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%' }}></div> Absent
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 📊 Right Pane: Detailed History */}
                    <div className="col-lg-7">
                        <div className="card h-100 shadow-lg border-0 p-4" style={{ borderRadius: "24px", background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <h5 className="fw-bold d-flex align-items-center text-info text-uppercase mb-4" style={{ fontSize: "0.85rem", letterSpacing: "2px" }}>
                                <FaClock className="me-2 text-info opacity-50" /> Detailed History
                            </h5>
                            
                            <div className="table-responsive rounded-4 overflow-hidden border border-white border-opacity-5 shadow-2xl">
                                <table className="table table-borderless align-middle mb-0" style={{ background: "#ffffff" }}>
                                    <thead className="bg-white border-bottom border-secondary border-opacity-10 text-dark" style={{ fontSize: "0.8rem", fontWeight: "800" }}>
                                        <tr>
                                            <th className="py-4 px-4">DATE</th>
                                            <th className="py-4">CHECK-IN</th>
                                            <th className="py-4">CHECK-OUT</th>
                                            <th className="py-4 px-4 text-center">STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: "0.85rem" }}>
                                        {attendanceRecord.length > 0 ? attendanceRecord.slice().reverse().map((rec, idx) => (
                                            <tr key={idx} className="border-bottom border-light">
                                                <td className="py-4 px-4 fw-bold text-dark">{rec.date}</td>
                                                <td className="py-4 text-dark fw-bold">{rec.checkIn || '--:--'}</td>
                                                <td className="py-4 text-dark fw-bold">{rec.checkOut || '--:--'}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <div style={{ 
                                                        display: "inline-block",
                                                        padding: "4px 12px",
                                                        background: rec.status?.toLowerCase() === 'present' ? "#10b981" : "#ef4444", 
                                                        color: "#fff",
                                                        borderRadius: "20px",
                                                        fontSize: "0.6rem",
                                                        fontWeight: "800",
                                                        textTransform: "uppercase",
                                                        boxShadow: `0 4px 10px ${rec.status?.toLowerCase() === 'present' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                                                    }}>
                                                        {rec.status}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-white-50 opacity-50">No history found for current trace.</td>
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
                .calendar-container .react-calendar {
                    background: transparent;
                    color: #fff;
                    border: none;
                }
                .react-calendar__navigation button { color: #fff; font-weight: 700; min-width: 44px; background: none; }
                .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus { background-color: rgba(255,255,255,0.05); }
                .react-calendar__month-view__weekdays__weekday { color: #0ea5e9; text-decoration: none; font-weight: 800; font-size: 0.75rem; }
                .react-calendar__tile { color: #fff; background: none; border-radius: 12px; height: 60px; font-weight: 600; }
                .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background-color: rgba(14, 165, 233, 0.2) !important; color: #fff; }
                .react-calendar__tile--now { background: rgba(255,255,255,0.05) !important; color: #0ea5e9 !important; border: 1px solid #0ea5e9 !important; }
                .react-calendar__tile--active { background: #0ea5e9 !important; color: white !important; }
                .react-calendar__month-view__days__tile--neighboringMonth { opacity: 0.2; }
                .table tr:hover { background-color: rgba(255, 255, 255, 0.02) !important; transition: 0.2s; }
            `}</style>
        </div>
    );
};

export default EmployeeAttendance;
