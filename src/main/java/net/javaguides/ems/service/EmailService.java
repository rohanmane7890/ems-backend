package net.javaguides.ems.service;

public interface EmailService {
    void sendLoginNotification(String email, String role);
    void sendForgotPasswordOtp(String email, String otp);
    void sendRegistrationOtp(String email, String otp);
    void sendLeaveStatusNotification(String email, String status, String startDate, String endDate);
    void sendLeaveRequestToAdmin(String adminEmail, String employeeName, String type, String startDate, String endDate, String reason);
}
