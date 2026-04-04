import React, { useEffect, useState } from 'react'
import { createEmployee, getEmployee, updateEmployee } from '../services/EmployeeService'
import { useNavigate, useParams } from 'react-router-dom'

const EmployeeComponent = () => {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")

    const { id } = useParams()
    const navigate = useNavigate()

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: ''
    })

    useEffect(() => {
        if (id) {
            getEmployee(id)
                .then(res => {
                    setFirstName(res.data.firstName || "")
                    setLastName(res.data.lastName || "")
                    setEmail(res.data.email || "")
                })
                .catch(console.error)
        }
    }, [id])

    function saveOrUpdateEmployee(e) {
        e.preventDefault()

        if (!validateForm()) return

        const employee = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim()
        }

        const action = id
            ? updateEmployee(id, employee)
            : createEmployee(employee)

        action
            .then(() => navigate('/employees'))
            .catch(console.error)
    }

    function validateForm() {
        let valid = true
        const errorsCopy = {}

        if (!firstName || !firstName.trim()) {
            errorsCopy.firstName = 'First name is required'
            valid = false
        }

        if (!lastName || !lastName.trim()) {
            errorsCopy.lastName = 'Last name is required'
            valid = false
        }

        if (!email || !email.trim()) {
            errorsCopy.email = 'Email is required'
            valid = false
        }

        setErrors(errorsCopy)
        return valid
    }
    function goBack() {
        navigate('/employees')
    }

    return (
        <div className='container'>
            <br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3'>
                    <h2 className='text-center'>
                        {id ? 'Update Employee' : 'Add Employee'}
                    </h2>

                    <div className='card-body'>
                        <form>
                            <div className='form-group mb-2'>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={firstName || ""}
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    onChange={e => setFirstName(e.target.value)}
                                />
                                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={lastName || ""}
                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                    onChange={e => setLastName(e.target.value)}
                                />
                                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label>Email</label>
                                <input
                                    type="text"
                                    value={email || ""}
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={goBack}
                                >
                                    Back
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-success"
                                    style={{ marginLeft: '10px' }}
                                    onClick={saveOrUpdateEmployee}
                                >
                                    Submit
                                </button>
                            </div>

                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeComponent
