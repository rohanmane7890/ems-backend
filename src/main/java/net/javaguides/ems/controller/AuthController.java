package net.javaguides.ems.controller;

import java.util.HashMap;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.dto.EmployeeDTO;
import net.javaguides.ems.mapper.EmployeeMapper;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.Security.JwtUtils;
import net.javaguides.ems.service.EmailService;
import net.javaguides.ems.service.OtpService;

@RestController
@RequestMapping("/api/auth")
@lombok.extern.slf4j.Slf4j
public class AuthController {
    private final EmployeeRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final OtpService otpService;
    private final JwtUtils jwtUtils;

    @org.springframework.beans.factory.annotation.Value("${app.admin.email}")
    private String adminEmail;

    @org.springframework.beans.factory.annotation.Value("${app.admin.master-pin}")
    private String masterPin;

    @org.springframework.beans.factory.annotation.Value("${app.admin.default-password}")
    private String defaultPassword;

    public AuthController(EmployeeRepository repository, PasswordEncoder passwordEncoder, 
                          EmailService emailService, OtpService otpService, JwtUtils jwtUtils) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.otpService = otpService;
        this.jwtUtils = jwtUtils;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        // 🛡️ VIRTUAL ADMIN LOGIN (No Database Record Required)
        if (adminEmail.equalsIgnoreCase(email) && defaultPassword.equals(password)) {
            log.info("Audit: Virtual Admin logged in successfully: {}", email);
            
            // Create a temporary in-memory employee for token generation
            Employee virtualAdmin = new Employee();
            virtualAdmin.setEmail(adminEmail);
            virtualAdmin.setRole(net.javaguides.ems.entity.Role.ADMIN);
            virtualAdmin.setFirstName("System");
            virtualAdmin.setLastName("Administrator");
            virtualAdmin.setId(0L); 

            String token = jwtUtils.generateToken(virtualAdmin);
            
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", "ADMIN");
            response.put("id", "0");
            response.put("message", "Virtual Admin Login successful!");
            return ResponseEntity.ok(response);
        }


        Employee employee = repository.findByEmail(email).orElse(null);

        if (employee != null) {
            if (employee.getStatus() != null && !employee.getStatus().equalsIgnoreCase("Active")) {
                log.warn("Audit: Failed login attempt for inactive account: {}", email);
                return ResponseEntity.status(401).body("Account is inactive! Please contact admin.");
            }

            if (passwordEncoder.matches(password, employee.getPassword())) {
                log.info("Audit: User {} logged in successfully.", email);
                // Return real JWT token and user info immediately
                String token = jwtUtils.generateToken(employee);
                
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("role", employee.getRole().name());
                response.put("id", String.valueOf(employee.getId()));
                response.put("message", "Login successful!");
                
                // Optional: Still trigger a notification email that someone logged in
                emailService.sendLoginNotification(employee.getEmail(), employee.getRole().name());

                return ResponseEntity.ok(response);
            }
        }

        log.warn("Audit: Failed login attempt for email: {}", email);
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

        if (employee != null && otpService.isOtpValid(email, otp)) {
            // Clear OTP after successful verification
            otpService.clearOtp(email);

            Map<String, String> response = new HashMap<>();
            response.put("role", employee.getRole().name());
            response.put("id", String.valueOf(employee.getId()));

            // Trigger Login Notification Email
            emailService.sendLoginNotification(employee.getEmail(), employee.getRole().name());

            // Generate real JWT token
            String token = jwtUtils.generateToken(employee);
            response.put("token", token);

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid or expired OTP!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody EmployeeDTO employeeDTO) {

        if (employeeDTO.getPassword() == null || employeeDTO.getPassword().length() < 6) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password must be at least 6 characters long!");
            return ResponseEntity.badRequest().body(response);
        }

        if (repository.findByEmail(employeeDTO.getEmail()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email is already taken! Please use a different email.");
            return ResponseEntity.badRequest().body(response);
        }

        Employee employee = EmployeeMapper.mapToEmployee(employeeDTO);
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        // Always set to EMPLOYEE for public registration
        employee.setRole(net.javaguides.ems.entity.Role.EMPLOYEE);

        if (employee.getStatus() == null) {
            employee.setStatus("Inactive");
        }

        if (employee.getJoiningDate() == null) {
            employee.setJoiningDate(java.time.LocalDate.now());
        }

        // Default salary to 0.0 for new registrations
        employee.setSalary(0.0);

        // Generate 6-digit OTP for registration
        String otp = otpService.generateOtp(employee.getEmail());

        repository.save(employee);

        // Send OTP via Email
        emailService.sendRegistrationOtp(employee.getEmail(), otp);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration successful! OTP sent to your email.");
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

        if (employee != null && otpService.isOtpValid(email, otp)) {
            // Clear OTP and activate user
            otpService.clearOtp(email);
            employee.setStatus("Active");
            repository.save(employee);

            // Generate real JWT token for Auto-Login
            String token = jwtUtils.generateToken(employee);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", employee.getRole().name());
            response.put("id", String.valueOf(employee.getId()));
            response.put("message", "Registration verified and account activated! Logging you in...");
            
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid or expired OTP!");
    }

    @PostMapping("/verify-master-pin")
    public ResponseEntity<?> verifyMasterPin(@RequestBody Map<String, String> request) {
        String pin = request.get("pin");
        if (masterPin != null && masterPin.equals(pin)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Master PIN verified");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body("Invalid Master PIN");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<Employee> employeeOpt = repository.findByEmail(email);

        if (employeeOpt.isEmpty()) {
            return ResponseEntity.status(404).body("No account found with this email.");
        }

        String otp = otpService.generateOtp(email);

        try {
            emailService.sendOtp(email, otp);
            return ResponseEntity.ok(Map.of("message", "OTP sent to your email."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending email: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        Optional<Employee> employeeOpt = repository.findByEmail(email);
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Invalid request.");
        }

        Employee employee = employeeOpt.get();
        if (otpService.isOtpValid(email, otp)) {
            employee.setPassword(passwordEncoder.encode(newPassword));
            otpService.clearOtp(email);
            repository.save(employee);
            return ResponseEntity.ok(Map.of("message", "Password reset successful!"));
        }

        return ResponseEntity.status(401).body("Invalid or expired OTP!");
    }
}
