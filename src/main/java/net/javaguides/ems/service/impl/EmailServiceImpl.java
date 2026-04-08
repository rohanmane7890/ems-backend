package net.javaguides.ems.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import net.javaguides.ems.service.EmailService;

@Service
@SuppressWarnings("null")
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
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("🔐 Security Alert: Password Reset OTP");

            String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; padding: 20px;\">" +
                    "<div style=\"max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);\">" +
                    "<div style=\"background: #0f172a; padding: 25px; text-align: center;\">" +
                    "<h1 style=\"color: #38bdf8; margin: 0; font-size: 20px; letter-spacing: 1px;\">NEXGEN SECURITY</h1>" +
                    "</div>" +
                    "<div style=\"padding: 30px; text-align: center;\">" +
                    "<h2 style=\"color: #0f172a; margin-top: 0;\">Password Reset Requested</h2>" +
                    "<p style=\"color: #64748b; font-size: 15px;\">Use the secure code below to finalize your password reset. This code is valid for 10 minutes.</p>" +
                    "<div style=\"background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px dashed #cbd5e1;\">" +
                    "<span style=\"font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;\">" + otp + "</span>" +
                    "</div>" +
                    "<p style=\"color: #94a3b8; font-size: 13px;\">If you did not request this reset, please ignore this email or contact support.</p>" +
                    "</div>" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("✅ Elite Password Reset OTP sent to: " + email);
        } catch (Exception e) {
            System.err.println("❌ Failed to send Password Reset OTP email: " + e.getMessage());
        }
    }

    @Async
    @Override
    public void sendRegistrationOtp(String email, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("🚀 Welcome to NexGen: Verify Your Account");

            String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; padding: 20px;\">" +
                    "<div style=\"max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);\">" +
                    "<div style=\"background: #0f172a; padding: 25px; text-align: center;\">" +
                    "<h1 style=\"color: #38bdf8; margin: 0; font-size: 20px; letter-spacing: 1px;\">NEXGEN WORKFORCE</h1>" +
                    "</div>" +
                    "<div style=\"padding: 30px; text-align: center;\">" +
                    "<h2 style=\"color: #0f172a; margin-top: 0;\">Account Verification</h2>" +
                    "<p style=\"color: #64748b; font-size: 15px;\">Welcome aboard! Enter the verification code below to activate your employee profile and enter the mission portal.</p>" +
                    "<div style=\"background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px dashed #cbd5e1;\">" +
                    "<span style=\"font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;\">" + otp + "</span>" +
                    "</div>" +
                    "<p style=\"color: #94a3b8; font-size: 13px;\">This code is valid for 10 minutes. Please do not share this code with anyone.</p>" +
                    "</div>" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("✅ Elite Registration OTP sent to: " + email);
        } catch (Exception e) {
            System.err.println("❌ Failed to send Registration OTP email: " + e.getMessage());
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

    @org.springframework.beans.factory.annotation.Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Async
    @Override
    public void sendTaskAssignmentEmail(String email, String taskTitle, String dueDate) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("🚨 Mission Assigned: " + taskTitle);

            String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; padding: 20px; color: #333;\">" +
                    "<div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);\">" +
                    "<div style=\"background: #0f172a; padding: 30px; text-align: center;\">" +
                    "<h1 style=\"color: #38bdf8; margin: 0; font-size: 24px; letter-spacing: -0.5px;\">NEXGEN WORKFORCE</h1>" +
                    "</div>" +
                    "<div style=\"padding: 30px;\">" +
                    "<h2 style=\"margin-top: 0; color: #0f172a;\">New Mission Dispatched</h2>" +
                    "<p style=\"font-size: 16px; line-height: 1.6;\">Dear Employee,</p>" +
                    "<p style=\"font-size: 16px; line-height: 1.6;\">A high-priority mission has been assigned to your station. Please review the details and finalize the task before the deadline.</p>" +
                    "<div style=\"background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #38bdf8; margin: 20px 0;\">" +
                    "<p style=\"margin: 0; color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: bold;\">Mission Title</p>" +
                    "<p style=\"margin: 5px 0 15px; font-size: 18px; font-weight: bold; color: #0f172a;\">" + taskTitle + "</p>" +
                    "<p style=\"margin: 0; color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: bold;\">Due Date</p>" +
                    "<p style=\"margin: 5px 0 0; font-size: 16px; font-weight: bold; color: #e11d48;\">" + dueDate + "</p>" +
                    "</div>" +
                    "</div>" +
                    "<div style=\"background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;\">" +
                    "&copy; 2026 NexGen Workforce Systems. Secure Cloud Dispatch." +
                    "</div>" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("✅ Elite HTML Mission briefing sent to: " + email);
        } catch (Exception e) {
            System.err.println("❌ CRITICAL: Failed to send HTML mission briefing: " + e.getMessage());
        }
    }
}
