package net.javaguides.ems.service;

public interface EmailService {
    void sendLoginNotification(String email, String role);
    void sendOtp(String email, String otp);
    void sendRegistrationOtp(String email, String otp);
    void sendLeaveStatusNotification(String email, String status, String startDate, String endDate);
}
