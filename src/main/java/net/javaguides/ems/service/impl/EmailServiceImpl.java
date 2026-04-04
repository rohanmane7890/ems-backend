package net.javaguides.ems.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import net.javaguides.ems.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendLoginNotification(String email, String role) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("ems-system@gmail.com"); // Usually configured in application.properties
            message.setTo(email);
            message.setSubject("Security Alert: New Login Detected");
            message.setText("Hello,\n\nA new login was detected for your account (" + email + ") with the role: " + role + ".\n\nIf this wasn't you, please contact support immediately.\n\nBest regards,\nEMS Team");

            mailSender.send(message);
            System.out.println("Login notification email sent to: " + email);
        } catch (Exception e) {
            System.err.println("Failed to send login notification email: " + e.getMessage());
            // We don't want to crash the login if email fails
        }
    }

    @Override
    public void sendOtp(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("ems-system@gmail.com");
            message.setTo(email);
            message.setSubject("Your Login OTP");
            message.setText("Hello,\n\nYour One-Time Password (OTP) for login is: " + otp + ".\n\nThis OTP is valid for 5 minutes. If you didn't request this, please ignore it.\n\nBest regards,\nEMS Team");

            mailSender.send(message);
            System.out.println("OTP email sent to: " + email);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
        }
    }
}
