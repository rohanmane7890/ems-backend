import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeesByDepartment, getAllEmployees, updateEmployee, checkIn, checkOut } from "../services/EmployeeService";
import { FaSearch, FaFilter, FaUserTie, FaEnvelope, FaBuilding, FaArrowLeft, FaSortAmountDown, FaCheck, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const SearchEmployeeComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("firstName");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAll();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [employees]); // Only filter when initial data is loaded or changed

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await getAllEmployees();
            setEmployees(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load employees");
            setLoading(false);
        }
    };

    const applyFilters = () => {
        if (!Array.isArray(employees)) return;

        let filtered = employees.filter(emp => {
            const matchesSearch = (emp.firstName + " " + (emp.lastName || "")).toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 emp.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesDept = department ? emp.department === department : true;
            const matchesStatus = status ? emp.status === status : true;
            
            return matchesSearch && matchesDept && matchesStatus;
        });

        // Sorting
        filtered.sort((a, b) => {
            const valA = (a[sortBy] || "").toString().toLowerCase();
            const valB = (b[sortBy] || "").toString().toLowerCase();
            return valA > valB ? 1 : -1;
        });

        setFilteredEmployees(filtered);
    };

    const handleToggleStatus = (employee) => {
        const newStatus = employee.status === "Active" ? "Inactive" : "Active";
        const updated = { ...employee, status: newStatus };
        updateEmployee(employee.id, updated)
            .then(() => {
                toast.success(`${employee.firstName}'s status updated to ${newStatus}`);
                fetchAll(); // Refresh the master list
            })
            .catch(() => toast.error("Failed to update status"));
    };

    return (
        <div style={{ 
            background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)", 
            minHeight: "100vh", 
            padding: "40px 0",
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="container" style={{ maxWidth: "1350px" }}>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <button className="btn btn-link text-decoration-none text-white-50 p-0 fw-bold hover-light" onClick={() => navigate("/admin-dashboard")}>
                        <FaArrowLeft className="me-2" /> Back to Dashboard
                    </button>
                    <h2 className="fw-bold mb-0 text-white" style={{ letterSpacing: "-1px" }}>Employee Directory</h2>
                </div>

                {/* Filter Card */}
                <div className="card border-0 shadow-2xl mb-5" style={{ borderRadius: "24px", background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <div className="card-body p-4">
                        <div className="row g-3 align-items-center">
                            <div className="col-lg-3">
                                <div className="input-group">
                                    <span className="input-group-text bg-transparent border-end-0 text-white-50" style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}><FaSearch /></span>
                                    <input 
                                        type="text" 
                                        className="form-control bg-transparent text-white border-start-0 shadow-none" 
                                        style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
                                        placeholder="Search by name..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2">
                                <select className="form-select bg-transparent text-white border-white border-opacity-10 shadow-none custom-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                                    <option value="" className="bg-dark">All Departments</option>
                                    <option value="IT" className="bg-dark">IT</option>
                                    <option value="HR" className="bg-dark">HR</option>
                                    <option value="Finance" className="bg-dark">Finance</option>
                                    <option value="Marketing" className="bg-dark">Marketing</option>
                                </select>
                            </div>
                            <div className="col-lg-2">
                                <select className="form-select bg-transparent text-white border-white border-opacity-10 shadow-none custom-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="" className="bg-dark">All Status</option>
                                    <option value="Active" className="bg-dark">Active</option>
                                    <option value="Inactive" className="bg-dark">Inactive</option>
                                </select>
                            </div>
                            <div className="col-lg-2">
                                <select className="form-select bg-transparent text-white border-white border-opacity-10 shadow-none custom-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="firstName" className="bg-dark">Sort by Name</option>
                                    <option value="department" className="bg-dark">Sort by Dept</option>
                                    <option value="status" className="bg-dark">Sort by Status</option>
                                </select>
                            </div>
                            <div className="col-lg-2">
                                <button 
                                    className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-lg d-flex align-items-center justify-content-center gap-2"
                                    onClick={applyFilters}
                                    style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", border: "none" }}
                                >
                                    <FaFilter className="small" /> Filter Data
                                </button>
                            </div>
                            <div className="col-lg-1 d-flex justify-content-center">
                                <div className="text-white-50 extra-small fw-bold text-center">
                                    <span className="text-white">{filteredEmployees.length}</span><br />FOUND
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                ) : (
                    <div className="row g-4">
                        <AnimatePresence>
                            {Array.isArray(filteredEmployees) && filteredEmployees.length > 0 ? (
                                filteredEmployees.map((emp, index) => (
                                    <motion.div 
                                        key={emp.id || index}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        className="col-md-6 col-lg-4"
                                    >
                                        <div className="card border-0 shadow-sm h-100 card-hover" style={{ borderRadius: "15px", overflow: "hidden" }}>
                                            <div className="card-body p-4">
                                                <div className="d-flex align-items-center mb-3">
                                                    <img 
                                                        src={(() => {
                                                            if (!emp.profilePhoto) return `https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=f8f9fa&color=0d6efd&size=64`;
                                                            const photo = emp.profilePhoto;
                                                            if (photo.includes('http') && photo.includes('/uploads/')) {
                                                                return `/uploads/${photo.split('/uploads/')[1]}`;
                                                            }
                                                            return photo.startsWith('/') ? photo : `/uploads/${photo}`;
                                                        })()} 
                                                        className="rounded-circle me-3 border" 
                                                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                        alt="User"
                                                    />
                                                    <div className="overflow-hidden">
                                                        <h5 className="fw-bold mb-0 text-truncate">{emp.firstName} {emp.lastName}</h5>
                                                        <span className="badge bg-light text-primary rounded-pill small">{emp.designation || 'Staff'}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="small text-muted mb-2 d-flex align-items-center">
                                                    <FaEnvelope className="me-2 text-primary" /> {emp.email}
                                                </div>
                                                <div className="small text-muted mb-3 d-flex align-items-center">
                                                    <FaBuilding className="me-2 text-primary" /> {emp.department || 'No Dept'}
                                                </div>

                                                <div className="d-flex align-items-center">
                                                    <span className="text-muted small me-2 font-italic text-uppercase" style={{ letterSpacing: "1px", fontSize: "0.6rem" }}>Account Status:</span>
                                                    <span className={`badge ${emp.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} px-3 rounded-pill`}>
                                                        {emp.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5">
                                    <div className="display-1 text-muted opacity-25 mb-3"><FaSearch /></div>
                                    <h4 className="text-muted">No employees match your search.</h4>
                                    <button className="btn btn-link" onClick={fetchAll}>Show All Employees</button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            <style>{`
                .card-hover {
                    transition: all 0.3s ease;
                }
                .card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                .bg-success-subtle { background-color: #d1e7dd; }
                .bg-danger-subtle { background-color: #f8d7da; }
            `}</style>
        </div>
    );
};

export default SearchEmployeeComponent;