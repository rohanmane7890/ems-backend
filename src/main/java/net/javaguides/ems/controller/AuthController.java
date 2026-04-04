package net.javaguides.ems.controller;

import java.util.HashMap;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.Security.JwtUtils;
import net.javaguides.ems.service.EmailService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final EmployeeRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtils jwtUtils;

    public AuthController(EmployeeRepository repository, PasswordEncoder passwordEncoder, 
                          EmailService emailService, JwtUtils jwtUtils) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtUtils = jwtUtils;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        Employee employee = repository.findByEmail(email).orElse(null);

        if (employee != null) {
            if (employee.getStatus() != null && !employee.getStatus().equalsIgnoreCase("Active")) {
                return ResponseEntity.status(401).body("Account is inactive! Please contact admin.");
            }

            if (passwordEncoder.matches(password, employee.getPassword())) {
                // Generate 6-digit OTP
                String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
                employee.setOtp(otp);
                employee.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(5));
                repository.save(employee);

                // Send OTP via Email
                emailService.sendOtp(employee.getEmail(), otp);

                Map<String, String> response = new HashMap<>();
                response.put("message", "OTP sent to your email. Please verify to complete login.");
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(401).body("Invalid email or password");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required");
        }

        Employee employee = repository.findByEmail(email).orElse(null);

        if (employee != null && otp.equals(employee.getOtp())) {
            if (employee.getOtpExpiry().isAfter(java.time.LocalDateTime.now())) {
                // Clear OTP after successful verification
                employee.setOtp(null);
                employee.setOtpExpiry(null);
                repository.save(employee);

                Map<String, String> response = new HashMap<>();
                response.put("role", employee.getRole().name());
                response.put("id", String.valueOf(employee.getId()));

                // Trigger Login Notification Email
                emailService.sendLoginNotification(employee.getEmail(), employee.getRole().name());

                // Generate real JWT token
                String token = jwtUtils.generateToken(employee);
                response.put("token", token);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("OTP has expired!");
            }
        }

        return ResponseEntity.status(401).body("Invalid OTP!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Employee employee) {

        if (repository.findByEmail(employee.getEmail()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email is already taken!");
            return ResponseEntity.badRequest().body(response);
        }

        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        // Always set to EMPLOYEE for public registration to keep ADMIN role virtual and secure
        employee.setRole(net.javaguides.ems.entity.Role.EMPLOYEE);

        if (employee.getStatus() == null) {
            employee.setStatus("Inactive"); // User is inactive until OTP is verified
        }

        if (employee.getJoiningDate() == null) {
            employee.setJoiningDate(java.time.LocalDate.now());
        }

        // Generate 6-digit OTP for registration
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        employee.setOtp(otp);
        employee.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));

        repository.save(employee);

        // Send OTP via Email
        emailService.sendOtp(employee.getEmail(), otp);

        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent to your email. Please verify to complete registration.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<?> verifyRegistration(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required");
        }

        Employee employee = repository.findByEmail(email).orElse(null);

        if (employee != null && otp.equals(employee.getOtp())) {
            if (employee.getOtpExpiry().isAfter(java.time.LocalDateTime.now())) {
                // Clear OTP and activate user
                employee.setOtp(null);
                employee.setOtpExpiry(null);
                employee.setStatus("Active");
                repository.save(employee);

                Map<String, String> response = new HashMap<>();
                response.put("message", "Registration verified and account activated successfully!");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("OTP has expired!");
            }
        }

        return ResponseEntity.status(401).body("Invalid OTP!");
    }
}
