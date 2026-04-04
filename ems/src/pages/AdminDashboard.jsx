import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardAnalytics, getAllEmployees } from "../services/EmployeeService";
import { 
    FaUsers, FaUserCheck, FaUserTimes, FaUserPlus, 
    FaChartBar, FaChartPie, FaHistory, FaSignOutAlt, 
    FaPlusCircle, FaList, FaSearch, FaCalendarAlt, FaFileExcel 
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function AdminDashboard() {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState({
        totalEmployees: 0,
        presentToday: 0,
        absentToday: 0,
        newJoinersThisMonth: 0,
        employeesByDepartment: {}
    });
    const [recentEmployees, setRecentEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!role || role !== "ADMIN") {
            navigate("/login");
        } else {
            fetchData();
        }
    }, [navigate, role]);

    const fetchData = async () => {
        try {
            const [analyticsRes, employeesRes] = await Promise.all([
                getDashboardAnalytics(),
                getAllEmployees()
            ]);
            setAnalytics(analyticsRes.data);
            setRecentEmployees(employeesRes.data.slice(-5).reverse());
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
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

    if (role !== "ADMIN") return null;

    const barData = {
        labels: Object.keys(analytics.employeesByDepartment),
        datasets: [{
            label: 'Employees by Department',
            data: Object.values(analytics.employeesByDepartment),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }]
    };

    const pieData = {
        labels: ['Present', 'Absent'],
        datasets: [{
            data: [analytics.presentToday, analytics.absentToday],
            backgroundColor: ['#28a745', '#dc3545'],
            hoverBackgroundColor: ['#218838', '#c82333']
        }]
    };

    return (
        <div style={{ 
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", 
            minHeight: "100vh",
            fontFamily: "'Inter', sans-serif"
        }}>

            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold text-white mb-1" style={{ letterSpacing: "-1px" }}>Dashboard Overview</h2>
                        <p className="text-info opacity-75">Welcome back, Admin! Here's what's happening today.</p>
                    </div>
                    <div className="text-end text-white-50 small">
                        Last Updated: {new Date().toLocaleDateString()}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="row g-4 mb-5">
                    {[
                        { title: "Total Employees", value: analytics.totalEmployees, icon: <FaUsers />, color: "#4e73df" },
                        { title: "Present Today", value: analytics.presentToday, icon: <FaUserCheck />, color: "#1cc88a" },
                        { title: "Absent Today", value: analytics.absentToday, icon: <FaUserTimes />, color: "#e74a3b" },
                        { title: "New Joiners", value: analytics.newJoinersThisMonth, icon: <FaUserPlus />, color: "#f6c23e" }
                    ].map((stat, idx) => (
                        <div key={idx} className="col-xl-3 col-md-6">
                            <div className="card shadow-lg border-0 h-100" style={{ 
                                background: "rgba(30, 41, 59, 0.7)", 
                                backdropFilter: "blur(12px)",
                                borderLeft: `5px solid ${stat.color}`, 
                                borderRadius: "15px",
                                border: "1px solid rgba(255, 255, 255, 0.1)"
                            }}>
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-uppercase mb-1" style={{ color: stat.color, fontSize: "0.85rem", letterSpacing: "1px" }}>
                                                {stat.title}
                                            </div>
                                            <div className="h4 mb-0 font-weight-bold text-white">{stat.value}</div>
                                        </div>
                                        <div className="col-auto">
                                            <span style={{ fontSize: "2.2rem", color: "rgba(255, 255, 255, 0.2)" }}>{stat.icon}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-4 mb-5">
                    {/* Charts */}
                    <div className="col-lg-8">
                        <div className="card shadow-2xl border-0 p-4 h-100" style={{ 
                            borderRadius: "20px", 
                            background: "rgba(30, 41, 59, 0.7)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                            <h5 className="fw-bold mb-4 d-flex align-items-center text-white">
                                <FaChartBar className="me-2 text-primary" /> Department Distribution
                            </h5>
                            <div style={{ height: "300px" }}>
                                <Bar data={barData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow-2xl border-0 p-4 h-100" style={{ 
                            borderRadius: "20px", 
                            background: "rgba(30, 41, 59, 0.7)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                            <h5 className="fw-bold mb-4 d-flex align-items-center text-white">
                                <FaChartPie className="me-2 text-success" /> Attendance Summary
                            </h5>
                            <div style={{ height: "300px" }}>
                                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Quick Actions */}
                    <div className="col-lg-4">
                        <div className="card shadow-2xl border-0 p-4 h-100" style={{ 
                            borderRadius: "20px", 
                            background: "rgba(30, 41, 59, 0.7)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                            <h5 className="fw-bold mb-4 text-white">Quick Actions</h5>
                            <div className="d-grid gap-3">
                                <Link to="/employees" className="btn btn-outline-success py-2 d-flex align-items-center justify-content-center">
                                    <FaList className="me-2" /> Manage Employees
                                </Link>
                                <Link to="/admin/leaves" className="btn btn-outline-warning py-2 d-flex align-items-center justify-content-center">
                                    <FaCalendarAlt className="me-2" /> Manage Leave Requests
                                </Link>
                                <Link to="/search" className="btn btn-outline-info py-2 d-flex align-items-center justify-content-center">
                                    <FaSearch className="me-2" /> Advanced Search
                                </Link>
                                <button onClick={exportToExcel} className="btn btn-outline-primary py-2 d-flex align-items-center justify-content-center">
                                    <FaFileExcel className="me-2" /> Export to Excel
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="col-lg-8">
                        <div className="card shadow-2xl border-0 p-4 h-100" style={{ 
                            borderRadius: "20px", 
                            background: "rgba(30, 41, 59, 0.7)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                            <h5 className="fw-bold mb-4 d-flex align-items-center text-white">
                                <FaHistory className="me-2 text-warning" /> Recent Joiners
                            </h5>
                            {recentEmployees.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle text-white">
                                        <thead style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                                            <tr className="text-white-50">
                                                <th>Name</th>
                                                <th>Department</th>
                                                <th>Join Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentEmployees.map(emp => (
                                                <tr key={emp.id}>
                                                    <td>{emp.firstName} {emp.lastName}</td>
                                                    <td>{emp.department}</td>
                                                    <td>{emp.joiningDate}</td>
                                                    <td>
                                                        <span className={`badge bg-${emp.status === 'Active' ? 'success' : 'secondary'} rounded-pill`}>
                                                            {emp.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-muted py-4">No recent activity detected.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
