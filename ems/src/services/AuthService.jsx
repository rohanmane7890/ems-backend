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
