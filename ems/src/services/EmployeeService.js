import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REST_API_BASE_URL = `${BASE_URL}/api/employees`;

const authHeader = () => {
    return {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    };
};





export const createEmployee = (employee) =>
    axios.post(REST_API_BASE_URL, employee, authHeader());

export const getAllEmployees = () =>
    axios.get(REST_API_BASE_URL, authHeader());

// 🔹 Get Single Employee
export const getEmployee = (employeeId) =>
    axios.get(`${REST_API_BASE_URL}/${employeeId}`, authHeader());

// 🔹 Upload Profile Photo
export const uploadEmployeePhoto = (employeeId, formData) => {
    formData.append("employeeId", employeeId);
    return axios.post(`${REST_API_BASE_URL}/upload-photo`, formData, {
        headers: {
            ...authHeader().headers,
            "Content-Type": "multipart/form-data"
        }
    });
};

// 🔹 Update Employee
export const updateEmployee = (employeeId, employee) =>
    axios.put(`${REST_API_BASE_URL}/${employeeId}`, employee, authHeader());

// 🔹 Delete Employee
export const deleteEmployee = (employeeId) =>
    axios.delete(`${REST_API_BASE_URL}/${employeeId}`, authHeader());

// 🔹 Search Employee by Department
export const getEmployeesByDepartment = (department) =>
    axios.get(`${REST_API_BASE_URL}/search?department=${department}`, authHeader());

// 🔹 Get Employees with Pagination
export const getEmployeesWithPagination = (page, size) =>
    axios.get(`${REST_API_BASE_URL}?page=${page}&size=${size}`, authHeader());

// 🔹 Get Employees by Status
export const getEmployeesByStatus = (status) =>
    axios.get(`${REST_API_BASE_URL}/status/${status}`, authHeader());

export const getEmployeeByEmail = (email) =>
    axios.get(`${REST_API_BASE_URL}/email/${email}`, authHeader());

// 🔹 Dashboard Analytics
export const getDashboardAnalytics = () =>
    axios.get(`${BASE_URL}/api/analytics/dashboard`, authHeader());

// 🔹 Attendance APIs
export const checkIn = (employeeId) =>
    axios.post(`${BASE_URL}/api/attendance/check-in/${employeeId}`, {}, authHeader());

export const checkOut = (employeeId) =>
    axios.post(`${BASE_URL}/api/attendance/check-out/${employeeId}`, {}, authHeader());

export const getAttendanceHistory = (employeeId) =>
    axios.get(`${BASE_URL}/api/attendance/employee/${employeeId}`, authHeader());

export const getAttendanceByDate = (date) =>
    axios.get(`${BASE_URL}/api/attendance/date?date=${date}`, authHeader());

// 🔹 Leave Management APIs
export const applyLeave = (leaveRequest) =>
    axios.post(`${BASE_URL}/api/leaves`, leaveRequest, authHeader());

export const getEmployeeLeaves = (employeeId) =>
    axios.get(`${BASE_URL}/api/leaves/employee/${employeeId}`, authHeader());

export const getPendingLeaves = () =>
    axios.get(`${BASE_URL}/api/leaves/pending`, authHeader());

export const updateLeaveStatus = (leaveId, status) =>
    axios.put(`${BASE_URL}/api/leaves/${leaveId}/status?status=${status}`, {}, authHeader());

// 🔹 Notification APIs
export const getNotifications = (employeeId) =>
    axios.get(`${BASE_URL}/api/notifications/employee/${employeeId}`, authHeader());

export const markNotificationAsRead = (id) =>
    axios.put(`${BASE_URL}/api/notifications/${id}/read`, {}, authHeader());

export const markAllNotificationsAsRead = (employeeId) =>
    axios.put(`${BASE_URL}/api/notifications/employee/${employeeId}/read-all`, {}, authHeader());

export const createNotification = (notificationData) =>
    axios.post(`${BASE_URL}/api/notifications`, notificationData, authHeader());

// 🔹 Profile & Password Management
export const updateProfile = (employeeId, employee) =>
    axios.put(`${REST_API_BASE_URL}/${employeeId}`, employee, authHeader());

export const changePassword = (employeeId, newPassword) =>
    axios.put(`${REST_API_BASE_URL}/${employeeId}/change-password?newPassword=${newPassword}`, {}, authHeader());

// 🔹 Work Log APIs
export const submitWorkLog = (workLog) =>
    axios.post(`${BASE_URL}/api/work-logs`, workLog, authHeader());

export const getEmployeeWorkLogs = (employeeId) =>
    axios.get(`${BASE_URL}/api/work-logs/employee/${employeeId}`, authHeader());

export const getAllWorkLogs = () =>
    axios.get(`${BASE_URL}/api/work-logs/all`, authHeader());

// 🔹 Task Assignment APIs
export const assignTask = (task) =>
    axios.post(`${BASE_URL}/api/tasks`, task, authHeader());

export const getEmployeeTasks = (employeeId) =>
    axios.get(`${BASE_URL}/api/tasks/employee/${employeeId}`, authHeader());

export const getAllTasks = () =>
    axios.get(`${BASE_URL}/api/tasks/all`, authHeader());

export const updateTaskStatus = (taskId, status) =>
    axios.put(`${BASE_URL}/api/tasks/${taskId}/status?status=${status}`, {}, authHeader());

export const assignTaskToDepartment = (dept, task) =>
    axios.post(`${BASE_URL}/api/tasks/department?dept=${dept}`, task, authHeader());

export const assignTaskByDesignation = (designation, task) =>
    axios.post(`${BASE_URL}/api/tasks/designation?designation=${designation}`, task, authHeader());

// 🔹 Salary Transaction APIs
export const getSalaryHistory = (employeeId) =>
    axios.get(`${BASE_URL}/api/salaries/history/${employeeId}`, authHeader());

export const paySalary = (paymentData) =>
    axios.post("/api/salaries/pay", paymentData, authHeader());