package net.javaguides.ems.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import net.javaguides.ems.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    @Async
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

    @Async
    @Override
    public void sendForgotPasswordOtp(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Password Reset: Your One-Time Password (OTP)");
            message.setText("Hello,\n\nYou have requested to reset your password. Your One-Time Password (OTP) is:\n\n" + otp
                    + "\n\nThis OTP is valid for 10 minutes. If you did not request this reset, please change your password immediately or contact support.\n\nBest regards,\nEMS Corporate Team");

            mailSender.send(message);
            System.out.println("✅ Password Reset OTP email sent to: " + email + " | OTP: " + otp);
        } catch (Exception e) {
            System.err.println("❌ Failed to send Password Reset OTP email: " + e.getMessage());
        }
    }

    @Async
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

    @Async
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

    @Async
    @Override
    public void sendLeaveRequestToAdmin(String adminEmail, String employeeName, String type, String startDate, String endDate, String reason) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(adminEmail);
            message.setSubject("New Leave Request: " + employeeName + " (" + type + ")");
            message.setText("Dear Administrator,\n\nA new leave request has been submitted by an employee.\n\n" +
                    "Employee Name: " + employeeName + "\n" +
                    "Leave Type: " + type + "\n" +
                    "Period: " + startDate + " to " + endDate + "\n" +
                    "Reason: " + reason + "\n\n" +
                    "Please log in to the EMS Admin Dashboard to approve or reject this request.\n\n" +
                    "Best regards,\nEMS Automated System");

            mailSender.send(message);
            System.out.println("✅ Leave request notification sent to Admin: " + adminEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send leave request notification to Admin: " + e.getMessage());
        }
    }
}
