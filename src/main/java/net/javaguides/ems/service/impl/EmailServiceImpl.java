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

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendLoginNotification(String email, String role) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Security Alert: New Login Detected");
            message.setText("Hello,\n\nA new login was detected for your account (" + email + ") with the role: " + role
                    + ".\n\nIf this wasn't you, please contact support immediately.\n\nBest regards,\nEMS Team");

            mailSender.send(message);
            System.out.println("Login notification email sent to: " + email);
        } catch (Exception e) {
            System.err.println("Failed to send login notification email: " + e.getMessage());
        }
    }

    @Override
    public void sendOtp(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Your Login OTP");
            message.setText("Hello,\n\nYour One-Time Password (OTP) for login is: " + otp
                    + ".\n\nThis OTP is valid for 5 minutes. If you didn't request this, please ignore it.\n\nBest regards,\nEMS Team");

            mailSender.send(message);
            System.out.println("OTP email sent to: " + email + " | OTP: " + otp);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
        }
    }

    @Override
    public void sendRegistrationOtp(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Account Registration: Your OTP Code");
            message.setText(
                    "Dear Employee,\n\nWelcome to EMS! We are excited to have you on board. Your verification code to activate your account is:\n\n"
                            + otp
                            + "\n\nThis OTP is valid for 10 minutes. Please enter it on the registration page to finalize your setup.\n\nBest regards,\nEMS Corporate Team");

            mailSender.send(message);
            System.out.println("✅ Registration OTP sent to: " + email);
        } catch (Exception e) {
            System.err.println("❌ CRITICAL: Failed to send OTP email: " + e.getMessage());
            throw new RuntimeException("Email delivery failed. Please check your internet or email settings.");
        }
    }

    @Override
    public void sendLeaveStatusNotification(String email, String status, String startDate, String endDate) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Leave Request Update: " + status);
            message.setText("Dear Employee,\n\nYour leave request for the period " + startDate + " to " + endDate
                    + " has been " + status
                    + " by the Administrator.\n\nPlease check your dashboard for more details.\n\nBest regards,\nEMS Team");

            mailSender.send(message);
            System.out.println("✅ Leave status notification sent to: " + email);
        } catch (Exception e) {
            System.err.println("❌ Failed to send leave status notification email: " + e.getMessage());
        }
    }
}
