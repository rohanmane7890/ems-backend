import axios from "axios";

const BASE_URL = "/api/auth";

class AuthService {
    // Updated login with proper headers for CORS
    login(email, password) {
        return axios.post(`${BASE_URL}/login`, { email, password });
    }

    verifyOtp(email, otp) {
        return axios.post(`${BASE_URL}/verify-otp`, { email, otp });
    }

    register(userData) {
        return axios.post(`${BASE_URL}/register`, userData);
    }

    verifyRegistration(email, otp) {
        return axios.post(`${BASE_URL}/verify-registration`, { email, otp });
    }

    rollbackRegistration(email) {
        return axios.post(`${BASE_URL}/rollback-registration`, { email });
    }

    verifyMasterPin(pin) {
        return axios.post(`${BASE_URL}/verify-master-pin`, { pin });
    }

    forgotPassword(email) {
        return axios.post(`${BASE_URL}/forgot-password`, { email });
    }

    verifyResetOtp(email, otp) {
        return axios.post(`${BASE_URL}/verify-reset-otp`, { email, otp });
    }

    resetPassword(email, otp, newPassword) {
        return axios.post(`${BASE_URL}/reset-password`, { email, otp, newPassword });
    }

    saveUser(token, role) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
    }

    getToken() {
        return localStorage.getItem("token");
    }

    getRole() {
        return localStorage.getItem("role");
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    isLoggedIn() {
        return !!localStorage.getItem("token");
    }
}

export default new AuthService();
