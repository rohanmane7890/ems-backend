import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeByEmail } from "../services/EmployeeService";
import { 
    FaUser, FaEnvelope, FaPhone, FaBuilding, 
    FaBriefcase, FaMoneyBillWave, FaCalendarAlt, FaMapMarkerAlt,
    FaCamera, FaEdit, FaKey, FaChevronLeft
} from "react-icons/fa";

function EmployeeProfile() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
        } catch (error) {
            console.error("Profile error", error);
            setLoading(false);
        }
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100 bg-light text-primary fw-bold">Accessing Profile...</div>;

    return (
        <div style={{ background: "#f1f5f9", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "50px 20px" }}>
            {/* 🛡️ Large Indigo Card (Image 1 Style) */}
            <div className="card shadow-2xl border-0 overflow-hidden" style={{ width: "100%", maxWidth: "1000px", borderRadius: "16px", background: "#fff", display: "flex", flexDirection: "row", minHeight: "650px" }}>
                
                {/* 🛡️ Left Sidebar (Solid Blue) */}
                <div style={{ background: "#007bff", width: "35%", padding: "60px 30px", display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
                    <div className="position-relative mb-4">
                         <div className="rounded-circle bg-white bg-opacity-25 p-1">
                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "160px", height: "160px", overflow: "hidden" }}>
                                <FaUser style={{ fontSize: "5rem", color: "#007bff", opacity: "0.5" }} />
                            </div>
                         </div>
                         <button className="btn btn-sm btn-white rounded-circle position-absolute border-0 shadow-sm" style={{ bottom: "5px", right: "5px", background: "#fff", color: "#007bff", width: "35px", height: "35px" }}>
                            <FaCamera size={14} />
                         </button>
                    </div>

                    <h2 className="fw-bold mb-1 text-center" style={{ letterSpacing: "-1px" }}>{employee?.firstName} {employee?.lastName}</h2>
                    <div className="badge rounded-pill border border-white border-opacity-75 px-3 py-2 mb-5 d-flex align-items-center" style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.15)" }}>
                        <div className="rounded-circle bg-white me-2" style={{ width: "8px", height: "8px" }}></div> Active
                    </div>

                    <div className="d-grid gap-3 w-100">
                        <button className="btn fw-bold py-2 shadow-sm" style={{ background: "#fff", color: "#333", borderRadius: "8px" }}>
                            <FaEdit className="me-2" /> Edit Profile
                        </button>
                        <button className="btn btn-outline-light fw-bold py-2" style={{ borderRadius: "8px", borderWidth: "1px" }}>
                            <FaKey className="me-2" /> Change Password
                        </button>
                    </div>
                </div>

                {/* 🛡️ Right Content Area */}
                <div style={{ flex: 1, padding: "50px 60px", background: "#fff" }}>
                    <h4 className="fw-bold text-dark mb-5" style={{ fontSize: "1.6rem" }}>Profile Information</h4>

                    <div className="row g-5">
                        <ProfileField label="FIRST NAME" value={employee?.firstName} icon={<FaUser />} />
                        <ProfileField label="LAST NAME" value={employee?.lastName} icon={<FaUser />} />
                        <ProfileField label="EMAIL ADDRESS" value={employee?.email} icon={<FaEnvelope />} />
                        <ProfileField label="PHONE NUMBER" value={employee?.phoneNumber || 'N/A'} icon={<FaPhone />} />
                        <ProfileField label="DEPARTMENT" value={employee?.department || 'IT'} icon={<FaBuilding />} />
                        <ProfileField label="DESIGNATION" value={employee?.designation} icon={<FaBriefcase />} />
                        <ProfileField label="MONTHLY SALARY" value={`$ ${employee?.salary || '3000.0'}`} icon={<FaMoneyBillWave />} />
                        <ProfileField label="JOINING DATE" value={employee?.joiningDate || '2026-04-04'} icon={<FaCalendarAlt />} />
                        <ProfileField label="OFFICE ADDRESS" value={employee?.officeAddress || 'Pune'} icon={<FaMapMarkerAlt />} fullWidth />
                    </div>

                    <div className="mt-5 pt-5 border-top text-center">
                        <button onClick={() => navigate("/employee-dashboard")} className="btn btn-outline-secondary px-5 py-2 fw-bold" style={{ borderRadius: "8px", borderColor: "#ddd", color: "#777" }}>
                           Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
                .text-label { font-size: 0.75rem; color: #666; font-weight: 700; letter-spacing: 0.5px; }
                .text-value { font-size: 0.95rem; color: #333; font-weight: 600; margin-top: 4px; }
            `}</style>
        </div>
    );
}

function ProfileField({ label, value, icon, fullWidth = false }) {
    return (
        <div className={fullWidth ? "col-12" : "col-md-6"}>
            <div className="text-label text-uppercase">{label}</div>
            <div className="text-value d-flex align-items-center">
                <span className="text-primary me-2 opacity-75">{icon}</span> {value}
            </div>
        </div>
    );
}

export default EmployeeProfile;