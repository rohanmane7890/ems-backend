import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardAnalytics, getAllEmployees, getEmployee, checkIn, checkOut } from "../services/EmployeeService";
import { 
    FaUsers, FaUserCheck, FaUserTimes, FaUserPlus, 
    FaChartBar, FaChartPie, FaHistory, FaSignOutAlt, 
    FaPlusCircle, FaList, FaSearch, FaCalendarAlt, FaFileExcel 
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import axios from "axios";

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
    const [adminProfile, setAdminProfile] = useState(null);
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
            const empId = localStorage.getItem("employeeId");
            
            // Build the list of promises to fetch
            const promises = [
                getDashboardAnalytics().catch(err => { console.error("Analytics failed", err); return { data: {} }; }),
                getAllEmployees().catch(err => { console.error("Employee list failed", err); return { data: [] }; })
            ];

            // Only fetch from DB if it's not the hardcoded admin
            if (empId !== "-1") {
                promises.push(getEmployee(empId).catch(err => { console.error("Profile failed", err); return { data: null }; }));
            }

            const results = await Promise.all(promises);
            
            const analyticsData = results[0].data;
            const employeesData = results[1].data;
            let profileData = results[2]?.data || null;

            // Handle hardcoded admin profile
            if (empId === "-1") {
                profileData = {
                    firstName: "System",
                    lastName: "Admin",
                    email: "admin@gmail.com",
                    designation: "Super User"
                };
            }

            console.log("DEBUG: Analytics data fetched:", analyticsData);
            console.log("DEBUG: Employees data fetched:", employeesData);

            setAnalytics(analyticsData || { totalEmployees: 0, presentToday: 0, absentToday: 0, newJoinersThisMonth: 0 });
            setRecentEmployees(Array.isArray(employeesData) ? employeesData.slice(-5).reverse() : []);
            setAdminProfile(profileData);
            setLoading(false);
        } catch (error) {
            console.error("Critical error fetching dashboard data", error);
            setLoading(false);
            toast.error("Some data failed to load. Please refresh.");
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


    return (
        <div style={{ 
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", 
            minHeight: "100vh",
            fontFamily: "'Inter', sans-serif"
        }}>

            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold text-white mb-1" style={{ letterSpacing: "-1px" }}>
                            Welcome back, {adminProfile ? `${adminProfile.firstName} ${adminProfile.lastName}` : 'Admin'}!
                        </h2>
                        <p className="text-info opacity-75">{adminProfile ? `${adminProfile.designation} | ${adminProfile.email}` : "Here's what's happening today."}</p>
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
                                <Link to="/admin/attendance" className="btn btn-outline-primary py-2 d-flex align-items-center justify-content-center">
                                    <FaCalendarAlt className="me-2" /> Track Attendance
                                </Link>
                                <button onClick={exportToExcel} className="btn btn-outline-secondary py-2 d-flex align-items-center justify-content-center">
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
                                    <table className="table align-middle mb-0 table-borderless text-white" style={{ background: "transparent !important", backgroundColor: "transparent" }}>
                                        <thead>
                                            <tr className="text-info border-bottom border-secondary border-opacity-25" style={{ fontSize: "0.8rem", letterSpacing: "1.5px" }}>
                                                <th className="px-3 py-3 border-0 bg-transparent" style={{ width: "35%" }}>EMPLOYEE</th>
                                                <th className="border-0 bg-transparent" style={{ width: "25%" }}>DEPARTMENT</th>
                                                <th className="border-0 bg-transparent" style={{ width: "20%" }}>JOINING</th>
                                                <th className="border-0 text-center bg-transparent" style={{ width: "20%" }}>STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentEmployees.map(emp => (
                                                <tr key={emp.id} className="admin-table-row border-bottom border-secondary border-opacity-10" style={{ transition: "all 0.3s ease", background: "transparent" }}>
                                                    <td className="px-3 py-3 bg-transparent">
                                                        <div className="d-flex align-items-center">
                                                            <div className="rounded-circle bg-primary bg-opacity-20 d-flex align-items-center justify-content-center me-3 text-info fw-bold shadow-sm" style={{ width: "42px", height: "42px", fontSize: "0.85rem", border: "1px solid rgba(0, 255, 255, 0.2)" }}>
                                                                {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold text-white mb-0" style={{ fontSize: "0.95rem", lineHeight: "1.2" }}>{emp.firstName} {emp.lastName}</div>
                                                                <div className="text-info opacity-75" style={{ fontSize: "0.75rem" }}>{emp.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 bg-transparent">
                                                        <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2" style={{ fontSize: "0.7rem", fontWeight: "600" }}>
                                                            {emp.department || "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 bg-transparent">
                                                        <div className="text-white fw-bold small" style={{ fontSize: "0.8rem" }}>{emp.joiningDate || "N/A"}</div>
                                                    </td>
                                                    <td className="py-3 text-center bg-transparent">
                                                        <span className={`badge rounded-pill px-3 py-2 ${emp.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`} style={{ fontSize: "0.65rem", fontWeight: "700", border: "1px solid currentColor", minWidth: "80px" }}>
                                                            {emp.status?.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <style>{`
                                        .admin-table-row:hover {
                                            background: rgba(255, 255, 255, 0.03) !important;
                                            cursor: pointer;
                                        }
                                    `}</style>
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
