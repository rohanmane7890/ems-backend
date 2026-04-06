import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../services/EmployeeService";

function AddEmployee() {
    const navigate = useNavigate();

    const [employee, setEmployee] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        department: "",
        designation: "",
        salary: "",
        joiningDate: new Date().toISOString().split('T')[0],
        address: "",
        role: "EMPLOYEE",
        status: "Active",
        profilePhoto: ""
    });

    const designationsByDept = {
        "IT": ["Software Engineer", "Frontend Developer", "Backend Developer", "QA Engineer", "IT Support"],
        "HR": ["HR Manager", "Recruiter", "HR Coordinator", "Talent Acquisition"],
        "Finance": ["Accountant", "Financial Analyst", "Finance Manager", "Auditor"],
        "Marketing": ["Marketing Manager", "Social Media Expert", "SEO Specialist", "Content Writer"],
        "Sales": ["Sales Manager", "Sales Executive", "Account Manager"]
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "department") {
            setEmployee({ ...employee, [name]: value, designation: "" });
        } else {
            setEmployee({ ...employee, [name]: value });
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEmployee({ ...employee, profilePhoto: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const saveEmployee = (e) => {
        e.preventDefault();

        createEmployee(employee)
            .then(() => {
                alert("Employee Saved Successfully");
                navigate("/employees");
            })
            .catch((error) => {
                console.error(error);
                alert("Error saving employee");
            });
    };


    return (
        <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", minHeight: "100vh", paddingBottom: "50px" }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="d-flex align-items-center mb-4">
                            <button className="btn btn-link text-decoration-none text-muted p-0 me-3" onClick={() => navigate("/admin-dashboard")}>
                                ← Back
                            </button>
                            <h2 className="fw-bold mb-0">Add New Employee</h2>
                        </div>

                        <div className="card shadow-sm border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
                            <div className="row g-0">
                                <div className="col-md-4 bg-primary text-white p-5 d-flex flex-column align-items-center justify-content-center text-center">
                                    <div className="mb-4">
                                        {employee.profilePhoto ? (
                                            <img 
                                                src={employee.profilePhoto} 
                                                alt="Preview" 
                                                className="rounded-circle shadow-lg border border-4 border-white-50" 
                                                style={{ width: "150px", height: "150px", objectFit: "cover" }} 
                                            />
                                        ) : (
                                            <div className="rounded-circle bg-white-50 shadow-lg d-flex align-items-center justify-content-center" style={{ width: "150px", height: "150px" }}>
                                                <span className="display-1 fw-bold text-white opacity-50">?</span>
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="fw-bold">{employee.firstName || "New"} {employee.lastName || "Employee"}</h4>
                                    <p className="opacity-75 small mb-4">{employee.designation || "No Designation"} | {employee.department || "No Dept"}</p>
                                    
                                    <label className="btn btn-outline-light btn-sm rounded-pill px-4">
                                        Upload Photo
                                        <input type="file" hidden onChange={handlePhotoChange} accept="image/*" />
                                    </label>
                                </div>

                                <div className="col-md-8 p-5 bg-white">
                                    <form onSubmit={saveEmployee}>
                                        <h5 className="fw-bold mb-4 border-bottom pb-2">Personal Information</h5>
                                        <div className="row g-3 mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted">First Name</label>
                                                <input name="firstName" className="form-control bg-light border-0 py-2" value={employee.firstName} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted">Last Name</label>
                                                <input name="lastName" className="form-control bg-light border-0 py-2" value={employee.lastName} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted">Email Address</label>
                                                <input type="email" name="email" className="form-control bg-light border-0 py-2" value={employee.email} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted">Phone Number</label>
                                                <input name="phoneNumber" className="form-control bg-light border-0 py-2" value={employee.phoneNumber} onChange={handleChange} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-bold text-muted">Address</label>
                                                <textarea name="address" className="form-control bg-light border-0 py-2" rows="2" value={employee.address} onChange={handleChange}></textarea>
                                            </div>
                                        </div>

                                        <h5 className="fw-bold mb-4 border-bottom pb-2">Job & Account Details</h5>
                                        <div className="row g-3 mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted">Department</label>
                                                <select name="department" className="form-select bg-light border-0 py-2" value={employee.department} onChange={handleChange} required>
                                                    <option value="">Select Department</option>
                                                    {Object.keys(designationsByDept).map(dept => (
                                                        <option key={dept} value={dept}>{dept}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted">Designation</label>
                                                <select 
                                                    name="designation" 
                                                    className="form-select bg-light border-0 py-2" 
                                                    value={employee.designation} 
                                                    onChange={handleChange}
                                                    disabled={!employee.department}
                                                    required
                                                >
                                                    <option value="">Select Designation</option>
                                                    {employee.department && designationsByDept[employee.department].map(des => (
                                                        <option key={des} value={des}>{des}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted">Joining Date</label>
                                                <input type="date" name="joiningDate" className="form-control bg-light border-0 py-2" value={employee.joiningDate} onChange={handleChange} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted">Monthly Salary</label>
                                                <input type="number" name="salary" className="form-control bg-light border-0 py-2" value={employee.salary} onChange={handleChange} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted">Login Password</label>
                                                <input type="password" name="password" className="form-control bg-light border-0 py-2" value={employee.password} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted">Account Status</label>
                                                <select name="status" className="form-select bg-light border-0 py-2" value={employee.status} onChange={handleChange}>
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="text-end mt-4">
                                            <button type="submit" className="btn btn-primary px-5 py-2 fw-bold shadow-sm rounded-pill">
                                                Save Employee
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddEmployee;
