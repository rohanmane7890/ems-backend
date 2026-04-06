import axios from "axios";

const REST_API_BASE_URL = "/api/employees";

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
    axios.get("/api/analytics/dashboard", authHeader());

// 🔹 Attendance APIs
export const checkIn = (employeeId) =>
    axios.post(`/api/attendance/check-in/${employeeId}`, {}, authHeader());

export const checkOut = (employeeId) =>
    axios.post(`/api/attendance/check-out/${employeeId}`, {}, authHeader());

export const getAttendanceHistory = (employeeId) =>
    axios.get(`/api/attendance/employee/${employeeId}`, authHeader());

export const getAttendanceByDate = (date) =>
    axios.get(`/api/attendance/date?date=${date}`, authHeader());

// 🔹 Leave Management APIs
export const applyLeave = (leaveRequest) =>
    axios.post("/api/leaves", leaveRequest, authHeader());

export const getEmployeeLeaves = (employeeId) =>
    axios.get(`/api/leaves/employee/${employeeId}`, authHeader());

export const getPendingLeaves = () =>
    axios.get("/api/leaves/pending", authHeader());

export const updateLeaveStatus = (leaveId, status) =>
    axios.put(`/api/leaves/${leaveId}/status?status=${status}`, {}, authHeader());

// 🔹 Notification APIs
export const getNotifications = (employeeId) =>
    axios.get(`/api/notifications/employee/${employeeId}`, authHeader());

export const markNotificationAsRead = (id) =>
    axios.put(`/api/notifications/${id}/read`, {}, authHeader());

export const markAllNotificationsAsRead = (employeeId) =>
    axios.put(`/api/notifications/employee/${employeeId}/read-all`, {}, authHeader());

// 🔹 Profile & Password Management
export const updateProfile = (employeeId, employee) =>
    axios.put(`${REST_API_BASE_URL}/${employeeId}`, employee, authHeader());

export const changePassword = (employeeId, newPassword) =>
    axios.put(`${REST_API_BASE_URL}/${employeeId}/change-password?newPassword=${newPassword}`, {}, authHeader());

// 🔹 Work Log APIs
export const submitWorkLog = (workLog) =>
    axios.post("/api/work-logs", workLog, authHeader());

export const getEmployeeWorkLogs = (employeeId) =>
    axios.get(`/api/work-logs/employee/${employeeId}`, authHeader());

export const getAllWorkLogs = () =>
    axios.get("/api/work-logs/all", authHeader());

// 🔹 Task Assignment APIs
export const assignTask = (task) =>
    axios.post("/api/tasks", task, authHeader());

export const getEmployeeTasks = (employeeId) =>
    axios.get(`/api/tasks/employee/${employeeId}`, authHeader());

export const getAllTasks = () =>
    axios.get("/api/tasks/all", authHeader());

export const updateTaskStatus = (taskId, status) =>
    axios.put(`/api/tasks/${taskId}/status?status=${status}`, {}, authHeader());

export const assignTaskToDepartment = (dept, task) =>
    axios.post(`/api/tasks/department?dept=${dept}`, task, authHeader());

export const assignTaskByDesignation = (designation, task) =>
    axios.post(`/api/tasks/designation?designation=${designation}`, task, authHeader());