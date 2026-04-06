import React, { useEffect, useState } from "react";
import { getEmployee, updateEmployee } from "../services/EmployeeService";
import { useNavigate, useParams } from "react-router-dom";

const UpdateEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        status: "",
        password: "",
        profilePhoto: ""
    });

    const designationsByDept = {
        "IT": ["Software Engineer", "Lead Developer", "System Architect", "QA Engineer", "DevOps Engineer", "UI/UX Designer"],
        "HR": ["HR Manager", "Recruiter", "HR Specialist", "Talent Acquisition"],
        "Finance": ["Accountant", "Financial Analyst", "Finance Manager", "Auditor"],
        "Marketing": ["Marketing Specialist", "Content Strategist", "Social Media Manager", "SEO Specialist"],
        "Operations": ["Operations Manager", "Logistics Coordinator", "Project Manager"],
        "Sales": ["Sales Executive", "Account Manager", "Business Development", "Sales Lead"]
    };

    useEffect(() => {
        getEmployee(id)
            .then((response) => setEmployee(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        try {
            const res = await fetch("/api/employees/upload-photo", {
                method: "POST",
                body: formDataUpload
            });

            if (!res.ok) throw new Error("Upload failed");

            let imagePath = await res.text();
            imagePath = imagePath.replace(/"/g, ''); // Strip quotes

            setEmployee({ ...employee, profilePhoto: imagePath });
        } catch (error) {
            console.error("Upload error", error);
        }
    };

    const saveOrUpdateEmployee = (e) => {
        e.preventDefault();
        updateEmployee(id, employee)
            .then(() => navigate("/employees"))
            .catch(error => console.error(error));
    };

    return (
        <div style={{ 
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", 
            minHeight: "100vh",
            padding: "60px 0",
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <button className="btn btn-link text-decoration-none text-white-50 p-0 fw-bold hover-light" onClick={() => navigate("/employees")}>
                        <i className="ri-arrow-left-line me-2"></i> Back to List
                    </button>
                    <h2 className="fw-bold mb-0 text-white" style={{ letterSpacing: "-1px" }}>Manage Employee</h2>
                </div>
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card border-0 shadow-2xl overflow-hidden" style={{ borderRadius: "24px", background: "rgba(255, 255, 255, 0.98)" }}>
                        <div
                            className="card-header text-white text-center py-4 border-0"
                            style={{ background: "linear-gradient(90deg, #3b82f6, #2563eb)" }}
                        >
                            <h4 className="mb-0 fw-bold">Update Employee Details</h4>
                        </div>
                        <div className="card-body p-4">
                            <form>
                                {/* First Name */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={employee.firstName || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="floatingFirstName"
                                        placeholder="First Name"
                                    />
                                    <label htmlFor="floatingFirstName">First Name</label>
                                </div>

                                {/* Last Name */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={employee.lastName || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="floatingLastName"
                                        placeholder="Last Name"
                                    />
                                    <label htmlFor="floatingLastName">Last Name</label>
                                </div>

                                {/* Email */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="email"
                                        name="email"
                                        value={employee.email || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="floatingEmail"
                                        placeholder="Email"
                                    />
                                    <label htmlFor="floatingEmail">Email</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <select
                                        name="department"
                                        value={employee.department || ""}
                                        onChange={(e) => setEmployee({ ...employee, department: e.target.value, designation: "" })}
                                        className="form-select"
                                        id="floatingDept"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {Object.keys(designationsByDept).map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="floatingDept">Department</label>
                                </div>

                                {/* Phone Number */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={employee.phoneNumber || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="floatingPhone"
                                        placeholder="Phone Number"
                                    />
                                    <label htmlFor="floatingPhone">Phone Number</label>
                                </div>

                                {/* Designation */}
                                <div className="form-floating mb-3">
                                    <select
                                        name="designation"
                                        value={employee.designation || ""}
                                        onChange={handleChange}
                                        className="form-select"
                                        id="floatingDesg"
                                        required
                                        disabled={!employee.department}
                                    >
                                        <option value="">Select Designation</option>
                                        {employee.department && designationsByDept[employee.department].map(desg => (
                                            <option key={desg} value={desg}>{desg}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="floatingDesg">Designation</label>
                                </div>

                                {/* Salary */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="number"
                                        name="salary"
                                        value={employee.salary || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="floatingSalary"
                                        placeholder="Salary"
                                    />
                                    <label htmlFor="floatingSalary">Salary</label>
                                </div>

                                {/* Joining Date */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={employee.joiningDate || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="floatingJoining"
                                    />
                                    <label htmlFor="floatingJoining">Joining Date</label>
                                </div>

                                {/* Address */}
                                <div className="mb-3">
                                    <label className="form-label small text-muted fw-bold">Address</label>
                                    <textarea
                                        name="address"
                                        value={employee.address || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="2"
                                    ></textarea>
                                </div>

                                {/* Status & Role */}
                                <div className="row g-2 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted fw-bold">Status</label>
                                        <select
                                            name="status"
                                            value={employee.status || ""}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-muted fw-bold">Role</label>
                                        <select
                                            name="role"
                                            value={employee.role || "EMPLOYEE"}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="EMPLOYEE">Employee</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="password"
                                        value={employee.password || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        id="floatingPassword"
                                        placeholder="Password"
                                    />
                                    <label htmlFor="floatingPassword">Password</label>
                                    <small className="text-muted">Leave blank if you do not want to change it</small>
                                </div>

                                {/* Profile Photo */}
                                <div className="mb-4">
                                    <label className="form-label small text-muted fw-bold">Profile Photo</label>
                                    <div className="d-flex align-items-center gap-3">
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={handlePhotoChange}
                                            accept="image/*"
                                        />
                                        {(employee.profilePhoto) && (
                                            <img 
                                                src={employee.profilePhoto.includes('http') && employee.profilePhoto.includes('/uploads/') 
                                                    ? `/uploads/${employee.profilePhoto.split('/uploads/')[1]}` 
                                                    : (employee.profilePhoto.startsWith('/') ? employee.profilePhoto : `/uploads/${employee.profilePhoto}`)} 
                                                alt="Preview" 
                                                className="rounded-circle border" 
                                                style={{ width: "50px", height: "50px", objectFit: "cover" }} 
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex gap-3 mt-4">
                                    <button
                                        className="btn btn-primary flex-grow-1 py-3 fw-bold shadow-sm"
                                        style={{ borderRadius: "12px" }}
                                        onClick={saveOrUpdateEmployee}
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-light flex-grow-1 py-3 fw-bold border"
                                        style={{ borderRadius: "12px" }}
                                        onClick={() => navigate("/employees")}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default UpdateEmployee;