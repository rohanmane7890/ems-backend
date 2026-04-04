import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getAttendanceHistory } from "../services/EmployeeService";
import { FaDownload, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function EmployeeAttendance() {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [employeeName, setEmployeeName] = useState("");
    const [employeeEmail, setEmployeeEmail] = useState("");

    useEffect(() => {
        const email = localStorage.getItem("loggedInEmail");
        if (!email) {
            navigate("/login");
            return;
        }
        setEmployeeEmail(email);
        fetchAttendance();
    }, [navigate]);

    const fetchAttendance = async () => {
        try {
            const employeeId = localStorage.getItem("employeeId");
            if (!employeeId) {
                toast.error("Employee ID not found. Please login again.");
                return;
            }
            const res = await getAttendanceHistory(employeeId);
            setAttendance(res.data);
            setLoading(false);
            
            // Try to set name from local data if available, or just use email prefix
            const email = localStorage.getItem("loggedInEmail");
            setEmployeeName(email.split('@')[0].toUpperCase());
            
        } catch (error) {
            console.error("Error fetching attendance", error);
            setLoading(false);
        }
    };

    const getTileContent = ({ date, view }) => {
        if (view === 'month') {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            const record = attendance.find(a => a.date === dateString);
            if (record) {
                return (
                    <div className="text-center mt-1">
                        {record.status === 'PRESENT' ? (
                            <FaCheckCircle className="text-success" size={12} />
                        ) : (
                            <FaTimesCircle className="text-danger" size={12} />
                        )}
                    </div>
                );
            }
        }
        return null;
    };

    const exportToExcel = () => {
        // Create custom data structure for Excel to include employee info
        const exportData = attendance.map(a => ({
            "Employee Name": employeeName,
            "Email": employeeEmail,
            "Date": a.date,
            "Check-In": a.checkIn || '--',
            "Check-Out": a.checkOut || '--',
            "Status": a.status
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        XLSX.writeFile(workbook, `${employeeName}_Attendance_Report.xlsx`);
        toast.success("Excel report exported!");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Attendance Report", 14, 20);
        doc.setFontSize(12);
        doc.text(`Employee: ${employeeName}`, 14, 30);
        doc.text(`Email: ${employeeEmail}`, 14, 38);
        
        const tableColumn = ["Date", "Check-In", "Check-Out", "Status"];
        const tableRows = attendance.map(a => [
            a.date, 
            a.checkIn ? a.checkIn.split('.')[0] : '--', 
            a.checkOut ? a.checkOut.split('.')[0] : '--', 
            a.status
        ]);
        doc.autoTable(tableColumn, tableRows, { startY: 45 });
        doc.save(`${employeeName}_Attendance_Report.pdf`);
        toast.success("PDF report exported!");
    };

    return (
        <div style={{ backgroundColor: "#f4f7f6", minHeight: "100vh", padding: "40px 0" }}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button className="btn btn-outline-secondary d-flex align-items-center" onClick={() => navigate(-1)}>
                        <FaArrowLeft className="me-2" /> Back
                    </button>
                    <div className="d-flex gap-2">
                        <button className="btn btn-success d-flex align-items-center" onClick={exportToExcel}>
                            <FaDownload className="me-2" /> Excel
                        </button>
                        <button className="btn btn-danger d-flex align-items-center" onClick={exportToPDF}>
                            <FaDownload className="me-2" /> PDF
                        </button>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: "15px" }}>
                            <h4 className="fw-bold mb-4">Attendance Calendar</h4>
                            <div className="d-flex justify-content-center">
                                <Calendar 
                                    onChange={setSelectedDate} 
                                    value={selectedDate} 
                                    tileContent={getTileContent}
                                    className="border-0 shadow-none w-100 rounded"
                                />
                            </div>
                            <div className="mt-4 d-flex justify-content-center gap-4 small">
                                <span className="d-flex align-items-center"><FaCheckCircle className="text-success me-1" /> Present</span>
                                <span className="d-flex align-items-center"><FaTimesCircle className="text-danger me-1" /> Absent</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "15px" }}>
                            <h4 className="fw-bold mb-4 d-flex align-items-center">
                                <FaClock className="text-primary me-2" /> Detailed History
                            </h4>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Check-In</th>
                                            <th>Check-Out</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance.length > 0 ? (
                                            attendance.slice().reverse().map((att, i) => (
                                                <tr key={i}>
                                                    <td className="fw-bold">{att.date}</td>
                                                                                                        <td>{att.checkIn ? att.checkIn.split('.')[0] : '--:--'}</td>
                                                                                                        <td>{att.checkOut ? att.checkOut.split('.')[0] : '--:--'}</td>
                                                    <td>
                                                        <span className={`badge bg-${att.status === 'PRESENT' ? 'success' : 'danger'} rounded-pill`}>
                                                            {att.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">No attendance data found.</td>
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
                .react-calendar {
                    border: none;
                    background: transparent;
                }
                .react-calendar__tile--active {
                    background: #0d6efd !important;
                    border-radius: 5px;
                }
                .react-calendar__tile:hover {
                    background: #e9ecef !important;
                    border-radius: 5px;
                }
            `}</style>
        </div>
    );
}

export default EmployeeAttendance;