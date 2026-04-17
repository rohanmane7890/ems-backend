import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_API_URL = `${BASE_URL}/api/auth`;

class AuthService {
    // Updated login with proper headers for CORS
    login(email, password, secretPin = null) {
        return axios.post(`${AUTH_API_URL}/login`, { email, password, secretPin });
    }

    verifyOtp(email, otp) {
        return axios.post(`${AUTH_API_URL}/verify-otp`, { email, otp });
    }

    register(userData) {
        return axios.post(`${AUTH_API_URL}/register`, userData);
    }

    verifyRegistration(email, otp) {
        return axios.post(`${AUTH_API_URL}/verify-registration`, { email, otp });
    }

    rollbackRegistration(email) {
        return axios.post(`${AUTH_API_URL}/rollback-registration`, { email });
    }

    verifyMasterPin(pin) {
        return axios.post(`${AUTH_API_URL}/verify-master-pin`, { pin });
    }

    forgotPassword(email) {
        return axios.post(`${AUTH_API_URL}/forgot-password`, { email });
    }

    verifyResetOtp(email, otp) {
        return axios.post(`${AUTH_API_URL}/verify-reset-otp`, { email, otp });
    }

    resetPassword(email, otp, newPassword) {
        return axios.post(`${AUTH_API_URL}/reset-password`, { email, otp, newPassword });
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
