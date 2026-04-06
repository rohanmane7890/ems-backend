import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    getEmployeeByEmail, 
    updateProfile, 
    changePassword,
    uploadEmployeePhoto 
} from "../services/EmployeeService";
import { 
    FaUserCircle, FaSave, FaTimes, 
    FaKey, FaUserEdit, FaEnvelope, FaPhone, 
    FaMapMarkerAlt, FaBriefcase, FaCamera 
} from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

function EmployeeProfile() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    const designationsByDept = {
        "IT": ["Software Engineer", "Lead Developer", "System Architect", "QA Engineer", "DevOps Engineer", "UI/UX Designer"],
        "HR": ["HR Manager", "Recruiter", "HR Specialist", "Talent Acquisition"],
        "Finance": ["Accountant", "Financial Analyst", "Finance Manager", "Auditor"],
        "Marketing": ["Marketing Specialist", "Content Strategist", "Social Media Manager", "SEO Specialist"],
        "Operations": ["Operations Manager", "Logistics Coordinator", "Project Manager"],
        "Sales": ["Sales Executive", "Account Manager", "Business Development", "Sales Lead"]
    };

    useEffect(() => {
        const email = localStorage.getItem("loggedInEmail");
        if (email) {
            fetchEmployee(email);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const fetchEmployee = async (email) => {
        try {
            const res = await getEmployeeByEmail(email);
            setEmployee(res.data);
            setEditData(res.data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load profile");
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
            // 1. Upload photo to server
            const res = await uploadEmployeePhoto(formData);
            const fileName = res.data;

            // 2. Update employee profile with new photo filename
            const updatedEmployee = { ...employee, profilePhoto: fileName };
            await updateProfile(employee.id, updatedEmployee);
            
            // 3. Refresh state
            setEmployee(updatedEmployee);
            toast.success("Profile photo updated!");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload photo");
        } finally {
            setUploading(false);
        }
    };



    const handleUpdate = async () => {
        try {
            // 🛡️ Security: Prevent employees from updating sensitive fields
            const { status, role, salary, joiningDate, ...safeData } = editData;
            
            const res = await updateProfile(employee.id, safeData);
            setEmployee(res.data);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Update failed");
        }
    };


    const handleChangePass = async () => {
        if (passwords.newPass !== passwords.confirmPass) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            await changePassword(employee.id, passwords.newPass);
            toast.success("Password changed successfully!");
            setShowPasswordModal(false);
            setPasswords({ newPass: "", confirmPass: "" });
        } catch (error) {
            toast.error("Failed to change password");
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
    if (!employee) return null;

    return (
        <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "40px 0" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card border-0 shadow-lg overflow-hidden" 
                            style={{ borderRadius: "20px" }}
                        >
                            <div className="row g-0">
                                {/* Left Side: Photo & Status */}
                                <div className="col-md-4 bg-primary text-white text-center p-5 d-flex flex-column align-items-center justify-content-center">
                                    <div className="position-relative mb-4 group" style={{ cursor: "pointer" }}>
                                        <div className="position-relative">
                                            <img 
                                                src={employee.profilePhoto 
                                                    ? `http://localhost:8082/uploads/${employee.profilePhoto}` 
                                                    : `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=fff&color=0d6efd&size=150`
                                                }
                                                alt="Profile" 
                                                className="rounded-circle shadow-lg border border-4 border-white"
                                                style={{ width: "160px", height: "160px", objectFit: "cover", transition: "all 0.3s" }}
                                            />
                                            {/* Camera Overlay */}
                                            <label 
                                                htmlFor="photoUpload" 
                                                className="position-absolute bottom-0 end-0 bg-white text-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                                style={{ width: "40px", height: "40px", cursor: "pointer", border: "2px solid #0d6efd" }}
                                            >
                                                {uploading ? <span className="spinner-border spinner-border-sm"></span> : <FaCamera />}
                                            </label>
                                            <input 
                                                type="file" 
                                                id="photoUpload" 
                                                className="d-none" 
                                                accept="image/*" 
                                                onChange={handlePhotoUpload}
                                                disabled={uploading}
                                            />
                                        </div>
                                    </div>
                                    <h3 className="fw-bold mb-1">{employee.firstName} {employee.lastName}</h3>
                                    {/* 🛡️ Display-Only Status (Security Lock) */}
                                    <div 
                                        className={`badge ${employee.status === 'Active' ? 'bg-white text-primary' : 'bg-danger text-white'} rounded-pill px-3 py-2 mb-4 shadow-sm fw-bold`}
                                        style={{ fontSize: "0.85rem", opacity: 0.9 }}
                                    >
                                        <i className={`ri-checkbox-circle-fill me-1`}></i> {employee.status}
                                    </div>
                                    
                                    <div className="d-grid gap-2 w-100">
                                        {!isEditing ? (
                                            <button className="btn btn-light fw-bold" onClick={() => setIsEditing(true)}>
                                                <FaUserEdit className="me-2" /> Edit Profile
                                            </button>
                                        ) : (
                                            <>
                                                <button className="btn btn-success fw-bold" onClick={handleUpdate}>
                                                    <FaSave className="me-2" /> Save Changes
                                                </button>
                                                <button className="btn btn-danger fw-bold" onClick={() => { setIsEditing(false); setEditData(employee); }}>
                                                    <FaTimes className="me-2" /> Cancel
                                                </button>
                                            </>
                                        )}
                                        <button className="btn btn-outline-light mt-2" onClick={() => setShowPasswordModal(true)}>
                                            <FaKey className="me-2" /> Change Password
                                        </button>
                                    </div>
                                </div>

                                {/* Right Side: Details Feed */}
                                <div className="col-md-8 bg-white p-5">
                                    <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">Profile Information</h4>
                                    
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="text-muted small fw-bold text-uppercase">First Name</label>
                                            <div className="d-flex align-items-center mt-1">
                                                <FaUserCircle className="text-primary me-2" />
                                                {isEditing ? (
                                                    <input type="text" className="form-control" value={editData.firstName} onChange={(e) => setEditData({...editData, firstName: e.target.value})} />
                                                ) : <span className="fw-medium">{employee.firstName}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="text-muted small fw-bold text-uppercase">Last Name</label>
                                            <div className="d-flex align-items-center mt-1">
                                                <FaUserCircle className="text-primary me-2" />
                                                {isEditing ? (
                                                    <input type="text" className="form-control" value={editData.lastName} onChange={(e) => setEditData({...editData, lastName: e.target.value})} />
                                                ) : <span className="fw-medium">{employee.lastName}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="text-muted small fw-bold text-uppercase">Email Address</label>
                                            <div className="d-flex align-items-center mt-1">
                                                <FaEnvelope className="text-primary me-2" />
                                                {isEditing ? (
                                                    <input type="email" className="form-control" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} />
                                                ) : <span className="fw-medium">{employee.email}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="text-muted small fw-bold text-uppercase">Phone Number</label>
                                            <div className="d-flex align-items-center mt-1">
                                                <FaPhone className="text-primary me-2" />
                                                {isEditing ? (
                                                    <input type="text" className="form-control" value={editData.phoneNumber} onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})} />
                                                ) : <span className="fw-medium">{employee.phoneNumber || "Not provided"}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="text-muted small fw-bold text-uppercase">Department</label>
                                            <div className="d-flex align-items-center mt-1">
                                                <FaBriefcase className="text-primary me-2" />
                                                {isEditing ? (
                                                    <select 
                                                        className="form-select" 
                                                        value={editData.department || ""} 
                                                        onChange={(e) => setEditData({...editData, department: e.target.value, designation: ""})}
                                                    >
                                                        <option value="">Select Department</option>
                                                        {Object.keys(designationsByDept).map(dept => (
                                                            <option key={dept} value={dept}>{dept}</option>
                                                        ))}
                                                    </select>
                                                ) : <span className="fw-medium">{employee.department}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="text-muted small fw-bold text-uppercase">Designation</label>
                                            <div className="d-flex align-items-center mt-1">
                                                <FaBriefcase className="text-primary me-2" />
                                                {isEditing ? (
                                                    <select 
                                                        className="form-select" 
                                                        value={editData.designation || ""} 
                                                        onChange={(e) => setEditData({...editData, designation: e.target.value})}
                                                        disabled={!editData.department}
                                                    >
                                                        <option value="">Select Designation</option>
                                                        {editData.department && designationsByDept[editData.department].map(desg => (
                                                            <option key={desg} value={desg}>{desg}</option>
                                                        ))}
                                                    </select>
                                                ) : <span className="fw-medium">{employee.designation || "Not set"}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="text-muted small fw-bold text-uppercase">Monthly Salary</label>
                                            <div className="d-flex align-items-center mt-1">
                                                <span className="text-primary me-2 fw-bold">$</span>
                                                <span className="fw-medium">{employee.salary ? employee.salary.toLocaleString() : "Contact HR"}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="text-muted small fw-bold text-uppercase">Joining Date</label>
                                            <div className="d-flex align-items-center mt-1">
                                                <FaBriefcase className="text-primary me-2" />
                                                <span className="fw-medium">{employee.joiningDate}</span>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <label className="text-muted small fw-bold text-uppercase">Office Address</label>
                                            <div className="d-flex align-items-start mt-1">
                                                <FaMapMarkerAlt className="text-primary me-2 mt-1" />
                                                {isEditing ? (
                                                    <textarea className="form-control" value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} rows="2" />
                                                ) : <span className="fw-medium">{employee.address || "No address on record"}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-3 border-top">
                                        <button className="btn btn-outline-secondary px-4 me-2" onClick={() => navigate("/employee-dashboard")}>
                                            Back to Dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-dialog modal-dialog-centered"
                        >
                            <div className="modal-content border-0 shadow" style={{ borderRadius: "15px" }}>
                                <div className="modal-header bg-dark text-white border-0" style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}>
                                    <h5 className="modal-title ">Change Password</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowPasswordModal(false)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">New Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            value={passwords.newPass} 
                                            onChange={(e) => setPasswords({...passwords, newPass: e.target.value})} 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            value={passwords.confirmPass} 
                                            onChange={(e) => setPasswords({...passwords, confirmPass: e.target.value})} 
                                        />
                                    </div>
                                    <button className="btn btn-primary w-100 py-2 fw-bold" onClick={handleChangePass}>
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default EmployeeProfile;