import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeByEmail, updateProfile, changePassword, uploadEmployeePhoto } from "../services/EmployeeService";
import { 
    FaUser, FaEnvelope, FaPhone, FaBuilding, 
    FaBriefcase, FaMoneyBillWave, FaCalendarAlt, FaMapMarkerAlt,
    FaCamera, FaEdit, FaKey, FaChevronLeft, FaTimes, FaCheckCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function EmployeeProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 🛡️ Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPassModal, setShowPassModal] = useState(false);
    const [message, setMessage] = useState("");

    // 🛡️ Form States
    const [editData, setEditData] = useState({ firstName: "", lastName: "", phoneNumber: "", address: "", department: "", designation: "" });
    const [passData, setPassData] = useState({ newPass: "", confirmPass: "" });

    useEffect(() => {
        const email = localStorage.getItem("loggedInEmail");
        if (!email) {
            navigate("/login");
            return;
        }
        fetchData(email);
    }, [navigate]);

    const fetchData = async (email) => {
        try {
            const res = await getEmployeeByEmail(email);
            setEmployee(res.data);
            setEditData({
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                phoneNumber: res.data.phoneNumber || "",
                address: res.data.address || "",
                department: res.data.department || "",
                designation: res.data.designation || ""
            });
            setLoading(false);
        } catch (error) {
            console.error("Profile error", error);
            setLoading(false);
        }
    };

    // 🛡️ Photo Upload Logic
    const handlePhotoClick = () => fileInputRef.current.click();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const fileName = await uploadEmployeePhoto(employee.id, formData);
            // Refresh profile to show new image
            fetchData(employee.email);
            showToast("Photo updated successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            showToast("Failed to upload photo", true);
        }
    };

    // 🛡️ Edit Profile Submission
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(employee.id, { ...employee, ...editData });
            fetchData(employee.email);
            setShowEditModal(false);
            showToast("Profile updated!");
        } catch (error) {
            showToast("Update failed", true);
        }
    };

    // 🛡️ Change Password Submission
    const handlePassSubmit = async (e) => {
        e.preventDefault();
        if (passData.newPass !== passData.confirmPass) {
            showToast("Passwords do not match", true);
            return;
        }
        try {
            await changePassword(employee.id, passData.newPass);
            setShowPassModal(false);
            setPassData({ newPass: "", confirmPass: "" });
            showToast("Password changed successfully!");
        } catch (error) {
            showToast("Failed to change password", true);
        }
    };

    const showToast = (msg, isError = false) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100 bg-light text-primary fw-bold">Accessing Profile...</div>;

    const profileImageUrl = employee?.profilePhoto 
        ? `/uploads/${employee.profilePhoto}` 
        : null;

    return (
        <div style={{ background: "#f1f5f9", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "50px 20px" }}>
            
            {/* 🛡️ Toast Message */}
            <AnimatePresence>
                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0, y: -50 }}
                        className="position-fixed top-0 start-50 translate-middle-x z-3 shadow-lg px-4 py-2 rounded-pill bg-dark text-white fw-bold d-flex align-items-center"
                    >
                        <FaCheckCircle className="text-info me-2" /> {message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🛡️ Hidden File Input */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />

            {/* 🛡️ Large Indigo Card */}
            <div className="card shadow-2xl border-0 overflow-hidden" style={{ width: "100%", maxWidth: "1000px", borderRadius: "16px", background: "#fff", display: "flex", flexDirection: "row", minHeight: "650px" }}>
                
                {/* 🛡️ Left Sidebar (Solid Blue) */}
                <div style={{ background: "#007bff", width: "35%", padding: "60px 30px", display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
                    <div className="position-relative mb-4">
                         <div className="rounded-circle bg-white bg-opacity-25 p-1 transition-all" style={{ cursor: "pointer" }} onClick={handlePhotoClick}>
                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-lg" style={{ width: "160px", height: "160px", overflow: "hidden" }}>
                                {profileImageUrl ? (
                                    <img src={profileImageUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <FaUser style={{ fontSize: "5rem", color: "#007bff", opacity: "0.5" }} />
                                )}
                            </div>
                         </div>
                         <button onClick={handlePhotoClick} className="btn btn-sm btn-white rounded-circle position-absolute border-0 shadow-sm" style={{ bottom: "5px", right: "5px", background: "#fff", color: "#007bff", width: "35px", height: "35px" }}>
                            <FaCamera size={14} />
                         </button>
                    </div>

                    <h2 className="fw-bold mb-1 text-center" style={{ letterSpacing: "-1px" }}>{employee?.firstName} {employee?.lastName}</h2>
                    <div className="badge rounded-pill border border-white border-opacity-75 px-3 py-2 mb-5 d-flex align-items-center" style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.15)" }}>
                        <div className="rounded-circle bg-white me-2 animate-pulse" style={{ width: "8px", height: "8px" }}></div> Active
                    </div>

                    <div className="d-grid gap-3 w-100">
                        <button onClick={() => setShowEditModal(true)} className="btn fw-bold py-2 shadow-sm elite-btn-hover" style={{ background: "#fff", color: "#333", borderRadius: "8px" }}>
                            <FaEdit className="me-2" /> Edit Profile
                        </button>
                        <button onClick={() => setShowPassModal(true)} className="btn btn-outline-light fw-bold py-2 elite-btn-outline" style={{ borderRadius: "8px", borderWidth: "1px" }}>
                            <FaKey className="me-2" /> Change Password
                        </button>
                    </div>
                </div>

                {/* 🛡️ Right Content Area */}
                <div style={{ flex: 1, padding: "50px 60px", background: "#fff" }}>
                    <h4 className="fw-bold text-dark mb-5" style={{ fontSize: "1.6rem" }}>Profile Information</h4>

                    <div className="row g-4">
                        <ProfileField label="FIRST NAME" value={employee?.firstName} icon={<FaUser />} />
                        <ProfileField label="LAST NAME" value={employee?.lastName} icon={<FaUser />} />
                        <ProfileField label="EMAIL ADDRESS" value={employee?.email} icon={<FaEnvelope />} />
                        <ProfileField label="PHONE NUMBER" value={employee?.phoneNumber || 'Not Linked'} icon={<FaPhone />} />
                        <ProfileField label="DEPARTMENT" value={employee?.department} icon={<FaBuilding />} />
                        <ProfileField label="DESIGNATION" value={employee?.designation} icon={<FaBriefcase />} />
                        <ProfileField label="MONTHLY SALARY" value={`$ ${employee?.salary || '0.0'}`} icon={<FaMoneyBillWave />} />
                        <ProfileField label="JOINING DATE" value={employee?.joiningDate} icon={<FaCalendarAlt />} />
                        <ProfileField label="OFFICE ADDRESS" value={employee?.address || 'Not Linked'} icon={<FaMapMarkerAlt />} fullWidth />
                    </div>

                    <div className="mt-5 pt-5 border-top text-center">
                        <button onClick={() => navigate("/employee-dashboard")} className="btn btn-outline-secondary px-5 py-2 fw-bold" style={{ borderRadius: "8px", borderColor: "#ddd", color: "#777" }}>
                           Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* 🛡️ Edit Profile Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="position-fixed inset-0 z-5 d-flex align-items-center justify-content-center p-4 bg-dark bg-opacity-50" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-4 shadow-lg p-5 w-100" style={{ maxWidth: "500px" }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold m-0 text-dark">Edit Identity Deck</h5>
                                <FaTimes className="text-secondary cursor-pointer" onClick={() => setShowEditModal(false)} />
                            </div>
                            <form onSubmit={handleEditSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6 text-start">
                                        <label className="small fw-bold text-secondary mb-1">FIRST NAME</label>
                                        <input type="text" className="form-control" value={editData.firstName} onChange={(e) => setEditData({...editData, firstName: e.target.value})} required />
                                    </div>
                                    <div className="col-md-6 text-start">
                                        <label className="small fw-bold text-secondary mb-1">LAST NAME</label>
                                        <input type="text" className="form-control" value={editData.lastName} onChange={(e) => setEditData({...editData, lastName: e.target.value})} required />
                                    </div>
                                    <div className="col-md-6 text-start">
                                        <label className="small fw-bold text-secondary mb-1">DEPARTMENT</label>
                                        <input type="text" className="form-control" value={editData.department} onChange={(e) => setEditData({...editData, department: e.target.value})} required />
                                    </div>
                                    <div className="col-md-6 text-start">
                                        <label className="small fw-bold text-secondary mb-1">DESIGNATION</label>
                                        <input type="text" className="form-control" value={editData.designation} onChange={(e) => setEditData({...editData, designation: e.target.value})} required />
                                    </div>
                                    <div className="col-12 text-start">
                                        <label className="small fw-bold text-secondary mb-1">PHONE NUMBER</label>
                                        <input type="text" className="form-control" value={editData.phoneNumber} onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})} />
                                    </div>
                                    <div className="col-12 text-start">
                                        <label className="small fw-bold text-secondary mb-1">OFFICE ADDRESS</label>
                                        <textarea className="form-control" value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} rows="2" />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mt-4 py-2 fw-bold shadow-sm" style={{ background: "#007bff", borderRadius: "8px" }}>Save Identification</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 🛡️ Change Password Modal */}
            <AnimatePresence>
                {showPassModal && (
                    <div className="position-fixed inset-0 z-5 d-flex align-items-center justify-content-center p-4 bg-dark bg-opacity-50" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-4 shadow-lg p-5 w-100" style={{ maxWidth: "400px" }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold m-0 text-dark">Update Security Key</h5>
                                <FaTimes className="text-secondary cursor-pointer" onClick={() => setShowPassModal(false)} />
                            </div>
                            <form onSubmit={handlePassSubmit}>
                                <div className="text-start mb-3">
                                    <label className="small fw-bold text-secondary mb-1">NEW PASSWORD</label>
                                    <input type="password" placeholder="Min 6 characters" className="form-control" value={passData.newPass} onChange={(e) => setPassData({...passData, newPass: e.target.value})} required minLength="6" />
                                </div>
                                <div className="text-start mb-4">
                                    <label className="small fw-bold text-secondary mb-1">CONFIRM PASSWORD</label>
                                    <input type="password" placeholder="Repeat password" className="form-control" value={passData.confirmPass} onChange={(e) => setPassData({...passData, confirmPass: e.target.value})} required />
                                </div>
                                <button type="submit" className="btn btn-dark w-100 py-2 fw-bold shadow-sm" style={{ borderRadius: "8px" }}>Sync Security Code</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
                .text-label { font-size: 0.75rem; color: #666; font-weight: 700; letter-spacing: 0.5px; }
                .text-value { font-size: 0.95rem; color: #333; font-weight: 600; margin-top: 4px; }
                .cursor-pointer { cursor: pointer; }
                .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
                .elite-btn-hover:hover { background: #f8fafc !important; transform: translateY(-2px); transition: all 0.2s; }
                .elite-btn-outline:hover { background: rgba(255,255,255,0.1) !important; transform: translateY(-2px); transition: all 0.2s; }
            `}</style>
        </div>
    );
}

function ProfileField({ label, value, icon, fullWidth = false }) {
    return (
        <div className={fullWidth ? "col-12 text-start" : "col-md-6 text-start"}>
            <div className="text-label text-uppercase">{label}</div>
            <div className="text-value d-flex align-items-center">
                <span className="text-primary me-2 opacity-75">{icon}</span> {value}
            </div>
        </div>
    );
}

export default EmployeeProfile;