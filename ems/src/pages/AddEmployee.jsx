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
        joiningDate: "",
        address: "",
        role: "EMPLOYEE",
        status: "Active",
        profilePhoto: ""
    });

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
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
        <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
            <nav className="navbar navbar-dark bg-dark shadow">
                <div className="container">
                    <span className="navbar-brand fw-bold">Add New Employee</span>
                </div>
            </nav>

            <div className="container mt-5 mb-5">
                <div className="card shadow-lg border-0 p-4" style={{ borderRadius: "20px" }}>
                    <h4 className="mb-4 fw-bold text-primary">Employee Details</h4>
                    <form onSubmit={saveEmployee}>
                        <div className="row">
                            {/* First Name */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">First Name</label>
                                <input
                                    name="firstName"
                                    className="form-control"
                                    value={employee.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Last Name</label>
                                <input
                                    name="lastName"
                                    className="form-control"
                                    value={employee.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={employee.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={employee.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            {/* Phone */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Phone Number</label>
                                <input
                                    name="phoneNumber"
                                    className="form-control"
                                    value={employee.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Department</label>
                                <select 
                                    name="department" 
                                    className="form-select" 
                                    value={employee.department} 
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    <option value="IT">IT</option>
                                    <option value="HR">HR</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>

                            {/* Designation */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label text-muted small fw-bold">Designation</label>
                                <input
                                    name="designation"
                                    className="form-control shadow-sm"
                                    placeholder="e.g. Software Engineer"
                                    value={employee.designation}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Salary */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label text-muted small fw-bold">Salary (Monthly)</label>
                                <input
                                    type="number"
                                    name="salary"
                                    className="form-control shadow-sm"
                                    placeholder="e.g. 50000"
                                    value={employee.salary}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Joining Date */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label text-muted small fw-bold">Joining Date</label>
                                <input
                                    type="date"
                                    name="joiningDate"
                                    className="form-control shadow-sm"
                                    value={employee.joiningDate}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Address */}
                            <div className="col-12 mb-3">
                                <label className="form-label">Address</label>
                                <textarea
                                    name="address"
                                    className="form-control"
                                    rows="3"
                                    value={employee.address}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {/* Status */}
                            <div className="col-md-6 mb-4">
                                <label className="form-label">Status</label>
                                <select
                                    name="status"
                                    className="form-select"
                                    onChange={handleChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Profile Photo */}
                            <div className="col-md-6 mb-4">
                                <label className="form-label">Profile Photo</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={handlePhotoChange}
                                    accept="image/*"
                                />
                                {employee.profilePhoto && (
                                    <img 
                                        src={employee.profilePhoto} 
                                        alt="Preview" 
                                        className="mt-2 rounded-circle" 
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }} 
                                    />
                                )}
                            </div>
                        </div>

                        <div className="text-end">
                            <button className="btn btn-success px-4">Save Employee</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddEmployee;
