package net.javaguides.ems.service;

public interface EmailService {
    void sendLoginNotification(String email, String role);
    void sendOtp(String email, String otp);
}
