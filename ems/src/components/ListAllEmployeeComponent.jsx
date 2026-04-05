import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEmployees, deleteEmployee, updateEmployee } from "../services/EmployeeService";
import { FaDownload, FaPlus, FaArrowLeft, FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";

const ListEmployeeComponent = () => {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    // useEffect(() => {
    //     fetchAll();
    // }, []);

    const fetchAll = () => {
        getAllEmployees()
            .then((response) => setEmployees(Array.isArray(response.data) ? response.data : []))
            .catch(error => {
                console.log(error);
                setEmployees([]);
            });
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const exportToExcel = () => {
        const data = employees.map(({id, firstName, lastName, email, phoneNumber, department, joiningDate, status, salary}) => ({
            ID: id, 
            Name: `${firstName} ${lastName}`, 
            Email: email, 
            Phone: phoneNumber, 
            Dept: department, 
            Date: joiningDate, 
            Status: status,
            Salary: salary ? `₹${Number(salary).toLocaleString()}` : "N/A"
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Employees");
        XLSX.writeFile(wb, "Employee_List.xlsx");
        toast.success("Excel exported!");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Organization Employee List", 14, 15);
        const columns = ["Name", "Email", "Department", "Joining", "Status", "Salary"];
        const rows = employees.map(e => [
            `${e.firstName} ${e.lastName}`, 
            e.email, 
            e.department, 
            e.joiningDate, 
            e.status, 
            e.salary ? `₹${Number(e.salary).toLocaleString()}` : "N/A"
        ]);
        doc.autoTable(columns, rows, { startY: 20 });
        doc.save("Employee_List.pdf");
        toast.success("PDF exported!");
    };


    const handleEdit = (id) => {
        navigate(`/edit-employee/${id}`);
    };

    const removeEmployee = (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            deleteEmployee(id)
                .then(() => {
                    fetchAll();
                    toast.success("Employee deleted successfully");
                })
                .catch(error => {
                    console.error(error);
                    toast.error("Failed to delete employee");
                });
        }
    };

    const toggleStatus = (employee) => {
        const newStatus = employee.status === "Active" ? "Inactive" : "Active";
        const updatedEmployee = { ...employee, status: newStatus };
        
        updateEmployee(employee.id, updatedEmployee)
            .then(() => {
                toast.success(`Status updated to ${newStatus} for ${employee.firstName}`);
                fetchAll(); // Refresh the list
            })
            .catch(error => {
                console.error(error);
                toast.error("Failed to update status");
            });
    };

    return (
        <div className="container-fluid py-5" 
             style={{ 
                 background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", 
                 minHeight: "100vh",
                 fontFamily: "'Inter', sans-serif" 
             }}>
            <div className="container p-1">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <button className="btn d-flex align-items-center fw-bold shadow-sm" 
                        style={{ background: "rgba(255, 255, 255, 0.1)", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "10px", padding: "10px 20px" }}
                        onClick={() => navigate("/admin-dashboard")}>
                    <FaArrowLeft className="me-2" /> Back to Dashboard
                </button>
                <div className="d-flex gap-2">
                    <button className="btn btn-success d-flex align-items-center" onClick={exportToExcel} style={{ borderRadius: "10px" }}>
                        <FaFileExcel className="me-2" /> Export Excel
                    </button>
                    <button className="btn btn-danger d-flex align-items-center" onClick={exportToPDF} style={{ borderRadius: "10px" }}>
                        <FaFilePdf className="me-2" /> Export PDF
                    </button>
                </div>
            </div>
            <div className="text-center mb-5">
                <h1 className="text-white fw-bold display-5 mb-2" style={{ letterSpacing: "-1px" }}>Employee Directory</h1>
                <p className="text-info opacity-75">Secure management of your organization's talent pool</p>
            </div>
                                                                                                             
            <div className="card shadow-2xl border-0 overflow-hidden" 
                 style={{ 
                     background: "#ffffff", 
                     borderRadius: "28px",
                     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                 }}>

                <div className="card-body p-0">

                    <div className="table-responsive">
                        <table className="table table-hover align-middle text-center mb-0">
                            <thead style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                                <tr className="text-uppercase small fw-extrabold" style={{ letterSpacing: "1.2px", color: "#475569" }}>
                                    <th className="py-4 px-4 border-0">Id</th>
                                    <th className="py-4 border-0">Name</th>
                                    <th className="py-4 border-0">Email</th>
                                    <th className="py-4 border-0">Phone</th>
                                    <th className="py-4 border-0">Department</th>
                                    <th className="py-4 border-0">Joining</th>
                                    <th className="py-4 border-0">Salary</th>
                                    <th className="py-4 border-0">Status</th>
                                    <th className="py-4 border-0 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody style={{ background: "#ffffff" }}>
                                {Array.isArray(employees) && employees.length > 0 ? (
                                    employees.map((employee, index) => (
                                        <tr key={employee.id??employee.email} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td className="py-4 fw-bold" style={{ color: "#475569", fontSize: "0.9rem" }}>{index + 1}</td>
                                            <td className="py-4 fw-bold" style={{ color: "#1e293b", fontSize: "1.05rem" }}>
                                                {employee.firstName} {employee.lastName}
                                            </td>
                                            <td className="py-4 text-primary fw-bold" style={{ fontSize: "0.95rem" }}>{employee.email}</td>
                                            <td className="py-4 text-dark fw-bold">{employee.phoneNumber}</td>
                                            <td className="py-4 px-3">
                                                <span className="px-4 py-2 rounded-pill fw-bold" style={{ background: "#e2e8f0", color: "#1e293b", fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                                                    {employee.department || "N/A"}
                                                </span>
                                            </td>
                                            <td className="py-4 fw-bold small" style={{ color: "#475569" }}>{employee.joiningDate}</td>
                                            <td className="py-4 fw-bold text-success" style={{ fontSize: "1rem" }}>
                                                {employee.salary ? `₹${Number(employee.salary).toLocaleString()}` : "₹0"}
                                            </td>
                                            <td className="py-4">
                                                <button 
                                                    className={`btn px-4 py-2 rounded-pill small fw-extrabold ${employee.status === "Active"
                                                            ? "bg-success text-white"
                                                            : "bg-danger text-white"
                                                        }`} 
                                                    style={{ fontSize: "0.7rem", textTransform: "uppercase", transition: "all 0.3s ease", minWidth: "100px" }}
                                                    onClick={() => toggleStatus(employee)}
                                                    title={`Click to set as ${employee.status === "Active" ? "Inactive" : "Active"}`}
                                                >
                                                    {employee.status}
                                                </button>
                                            </td>
                                            <td className="py-4">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button
                                                        className="btn btn-sm fw-bold px-3 py-2"
                                                        style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "10px" }}
                                                        onClick={() => removeEmployee(employee.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center text-muted py-5 fw-bold">
                                            No Employees Found in Directory
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>

                <div className="card-footer py-4 text-center border-0 bg-light" style={{ color: "#64748b" }}>
                    Total Organization Members: <span className="text-dark fw-bold">{Array.isArray(employees) ? employees.length : 0}</span>
                </div>

            </div>
        </div>
    </div>
    );
};

export default ListEmployeeComponent;
