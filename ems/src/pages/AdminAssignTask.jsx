import React, { useState, useEffect } from "react";
import { getAllEmployees, assignTask, assignTaskToDepartment, assignTaskByDesignation } from "../services/EmployeeService";
import { FaTasks, FaUserCheck, FaCalendarAlt, FaAlignLeft, FaArrowLeft, FaSitemap, FaBriefcase, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminAssignTask() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [targetType, setTargetType] = useState("INDIVIDUAL"); // INDIVIDUAL, DEPARTMENT, DESIGNATION
    const [selectedTarget, setSelectedTarget] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: new Date().toISOString().split('T')[0],
        assignedBy: localStorage.getItem("loggedInEmail") || "Admin"
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        const filtered = employees.filter(emp => 
            (emp.firstName + " " + emp.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(filtered);
    }, [searchTerm, employees]);

    const fetchEmployees = async () => {
        try {
            const res = await getAllEmployees();
            const data = res.data;
            setEmployees(data);
            
            // Extract unique departments and designations
            const depts = [...new Set(data.map(e => e.department))].filter(Boolean);
            const roles = [...new Set(data.map(e => e.designation))].filter(Boolean);
            setDepartments(depts);
            setDesignations(roles);
            
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load employees");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (targetType === "INDIVIDUAL" && !formData.assignedTo) {
            toast.warning("Please select an employee");
            return;
        }
        if (targetType !== "INDIVIDUAL" && !selectedTarget) {
            toast.warning(`Please select a ${targetType.toLowerCase()}`);
            return;
        }

        try {
            if (targetType === "INDIVIDUAL") {
                await assignTask(formData);
                toast.success(`Task assigned to ${selectedEmployee.firstName}!`);
            } else if (targetType === "DEPARTMENT") {
                await assignTaskToDepartment(selectedTarget, formData);
                toast.success(`Task sent to all employees in ${selectedTarget}!`);
            } else if (targetType === "DESIGNATION") {
                await assignTaskByDesignation(selectedTarget, formData);
                toast.success(`Task sent to all ${selectedTarget}s!`);
            }

            setFormData({ ...formData, title: "", description: "", assignedTo: "" });
            setSelectedEmployee(null);
            setSelectedTarget("");
            setSearchTerm("");
        } catch (error) {
            toast.error("Failed to assign task");
        }
    };

    const handleSelectEmployee = (emp) => {
        setSelectedEmployee(emp);
        setFormData({ ...formData, assignedTo: emp.id });
        setSearchTerm(`${emp.firstName} ${emp.lastName}`);
        setShowDropdown(false);
    };

    return (
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", minHeight: "100vh", padding: "40px 0" }}>
            <div className="container d-flex flex-column align-items-center">
                <div className="row justify-content-center w-100">
                    <div className="col-lg-5">
                        <button className="btn btn-link text-decoration-none text-white-50 p-0 mb-3 fw-bold d-flex align-items-center" onClick={() => navigate("/admin-dashboard")}>
                            <FaArrowLeft className="me-2" /> Back
                        </button>
                        <div className="card border-0 shadow-2xl p-3" style={{ 
                            borderRadius: "20px", 
                            background: "rgba(255, 255, 255, 0.95)", 
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(0,0,0,0.05)"
                        }}>
                            <div className="text-center mb-3">
                                <div className="bg-primary bg-opacity-10 p-2 rounded-circle d-inline-block mb-2">
                                    <FaTasks className="text-primary fs-4" />
                                </div>
                                <h4 className="fw-bold text-dark mb-0">Assign New Task</h4>
                                <p className="text-muted extra-small mb-0">Specify work details for team members</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-uppercase text-muted ls-1" style={{ fontSize: "0.65rem" }}>Assignment Target</label>
                                    <div className="d-flex gap-2 mb-2">
                                        <button type="button" className={`btn btn-sm flex-grow-1 rounded-pill fw-bold py-1 shadow-sm ${targetType === "INDIVIDUAL" ? 'btn-primary' : 'btn-light border opacity-75'}`} style={{ fontSize: "0.8rem" }} onClick={() => setTargetType("INDIVIDUAL")}>
                                            <FaUser className="me-1" /> Individual
                                        </button>
                                        <button type="button" className={`btn btn-sm flex-grow-1 rounded-pill fw-bold py-1 shadow-sm ${targetType === "DEPARTMENT" ? 'btn-primary' : 'btn-light border opacity-75'}`} style={{ fontSize: "0.8rem" }} onClick={() => setTargetType("DEPARTMENT")}>
                                            <FaSitemap className="me-1" /> Dept
                                        </button>
                                        <button type="button" className={`btn btn-sm flex-grow-1 rounded-pill fw-bold py-1 shadow-sm ${targetType === "DESIGNATION" ? 'btn-primary' : 'btn-light border opacity-75'}`} style={{ fontSize: "0.8rem" }} onClick={() => setTargetType("DESIGNATION")}>
                                            <FaBriefcase className="me-1" /> Role
                                        </button>
                                    </div>

                                    {targetType === "INDIVIDUAL" ? (
                                        <div className="position-relative">
                                            <div className="input-group bg-light rounded-3 p-1 border">
                                                <span className="input-group-text bg-transparent border-0"><FaUserCheck className="text-muted" /></span>
                                                <input 
                                                    type="text" 
                                                    className="form-control bg-transparent border-0 py-2" 
                                                    placeholder="Search employee name or email..." 
                                                    value={searchTerm} 
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        setShowDropdown(true);
                                                    }}
                                                    onFocus={() => setShowDropdown(true)}
                                                />
                                            </div>
                                            {showDropdown && filteredEmployees.length > 0 && (
                                                <div className="position-absolute w-100 shadow-lg border-0 mt-1 overflow-auto bg-white" style={{ zIndex: 1000, borderRadius: "15px", maxHeight: "200px" }}>
                                                    {filteredEmployees.map(emp => (
                                                        <div key={emp.id} className="p-3 border-bottom search-item" onClick={() => handleSelectEmployee(emp)}>
                                                            <div className="fw-bold text-dark">{emp.firstName} {emp.lastName}</div>
                                                            <div className="text-muted extra-small">{emp.email} | {emp.department}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : targetType === "DEPARTMENT" ? (
                                        <div className="input-group bg-light rounded-3 p-1 border">
                                            <span className="input-group-text bg-transparent border-0"><FaSitemap className="text-muted" /></span>
                                            <select className="form-select bg-transparent border-0 py-2" value={selectedTarget} onChange={(e) => setSelectedTarget(e.target.value)}>
                                                <option value="">Select Department...</option>
                                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="input-group bg-light rounded-3 p-1 border">
                                            <span className="input-group-text bg-transparent border-0"><FaBriefcase className="text-muted" /></span>
                                            <select className="form-select bg-transparent border-0 py-2" value={selectedTarget} onChange={(e) => setSelectedTarget(e.target.value)}>
                                                <option value="">Select Designation...</option>
                                                {designations.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    {selectedEmployee && targetType === "INDIVIDUAL" && (
                                        <div className="mt-2 p-1 bg-primary bg-opacity-10 rounded-pill px-3 d-inline-block border border-primary border-opacity-10">
                                            <span className="extra-small fw-bold text-primary">Selected: {selectedEmployee.firstName} ({selectedEmployee.department})</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-uppercase text-muted ls-1" style={{ fontSize: "0.65rem" }}>Task Title / Subject</label>
                                    <div className="input-group input-group-sm bg-light rounded-3 p-1 border">
                                        <span className="input-group-text bg-transparent border-0"><FaTasks className="text-muted" /></span>
                                        <input 
                                            type="text" 
                                            className="form-control bg-transparent border-0" 
                                            placeholder="Quarterly Report..." 
                                            value={formData.title} 
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2">
                                    <div className="col-md-12">
                                        <label className="form-label small fw-bold text-uppercase text-muted ls-1" style={{ fontSize: "0.65rem" }}>Due Date</label>
                                        <div className="input-group input-group-sm bg-light rounded-3 p-1 border">
                                            <span className="input-group-text bg-transparent border-0"><FaCalendarAlt className="text-muted" /></span>
                                            <input 
                                                type="date" 
                                                className="form-control bg-transparent border-0" 
                                                value={formData.dueDate} 
                                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-uppercase text-muted ls-1" style={{ fontSize: "0.65rem" }}>Task Details</label>
                                    <div className="input-group input-group-sm bg-light rounded-3 p-1 border">
                                        <span className="input-group-text bg-transparent border-0 align-items-start pt-1"><FaAlignLeft className="text-muted" /></span>
                                        <textarea 
                                            className="form-control bg-transparent border-0" 
                                            rows="2" 
                                            placeholder="Details..." 
                                            value={formData.description} 
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-100 py-3 fw-bold shadow-lg rounded-pill transform-hover">
                                    Send Task to Employee
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .ls-1 { letter-spacing: 1px; }
                .transform-hover { transition: 0.3s; }
                .transform-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important; }
                .search-item:hover { background-color: #f8fafc; color: #2563eb; }
                .extra-small { font-size: 0.7rem; }
            `}</style>
        </div>
    );
}

export default AdminAssignTask;
