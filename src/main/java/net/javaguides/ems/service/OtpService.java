package net.javaguides.ems.service;

public interface OtpService {
    String generateOtp(String email);
    boolean isOtpValid(String email, String otp);
    void clearOtp(String email);
}
