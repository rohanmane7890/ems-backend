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
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("firstName");
    const navigate = useNavigate();

    useEffect(() => {
    
        fetchAll();
    }, []);

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

    const handleSearch = async () => {
        setLoading(true);
        try {
            // Using department filter if provided, or search term
            let data = [];
            if (department) {
                const res = await getEmployeesByDepartment(department);
                data = res.data;
            } else {
                const res = await getAllEmployees();
                data = res.data;
            }

            // Client-side filtering for search term and status
            let filtered = data.filter(emp => {
                const matchesSearch = (emp.firstName + " " + emp.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
                                     emp.email.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = status ? emp.status === status : true;
                return matchesSearch && matchesStatus;
            });

            // Sorting
            filtered.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));

            setEmployees(Array.isArray(filtered) ? filtered : []);
            setLoading(false);
        } catch (error) {
            toast.error("Search failed");
            setLoading(false);
        }
    };

    const handleToggleStatus = (employee) => {
        const newStatus = employee.status === "Active" ? "Inactive" : "Active";
        const updated = { ...employee, status: newStatus };
        updateEmployee(employee.id, updated)
            .then(() => {
                toast.success(`${employee.firstName}'s status updated to ${newStatus}`);
                handleSearch(); // Refresh list
            })
            .catch(() => toast.error("Failed to update status"));
    };

    return (
        <div style={{ 
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", 
            minHeight: "100vh", 
            padding: "40px 0",
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <button className="btn btn-link text-decoration-none text-white-50 p-0 fw-bold hover-light" onClick={() => navigate("/admin-dashboard")}>
                        <FaArrowLeft className="me-2" /> Back to Dashboard
                    </button>
                    <h2 className="fw-bold mb-0 text-white" style={{ letterSpacing: "-1px" }}>Employee Directory</h2>
                </div>

                {/* Filter Card */}
                <div className="card border-0 shadow-2xl mb-5" style={{ borderRadius: "20px", background: "rgba(255, 255, 255, 0.95)" }}>
                    <div className="card-body p-4">
                        <div className="row g-3">
                            <div className="col-lg-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
                                    <input 
                                        type="text" 
                                        className="form-control border-start-0" 
                                        placeholder="Search by name or email..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2">
                                <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                                    <option value="">All Departments</option>
                                    <option value="IT">IT</option>
                                    <option value="HR">HR</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>
                            <div className="col-lg-2">
                                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="col-lg-2">
                                <div className="input-group">
                                    <span className="input-group-text bg-white"><FaSortAmountDown className="text-muted" /></span>
                                    <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <option value="firstName">Sort by Name</option>
                                        <option value="department">Sort by Dept</option>
                                        <option value="status">Sort by Status</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-2">
                                <button className="btn btn-primary w-100 fw-bold" onClick={handleSearch}>
                                    Apply Filters
                                </button>
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
                            {Array.isArray(employees) && employees.length > 0 ? (
                                employees.map((emp, index) => (
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