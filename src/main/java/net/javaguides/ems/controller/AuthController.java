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

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final EmployeeRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final net.javaguides.ems.service.EmailService emailService;
    private final net.javaguides.ems.Config.AdminProperties adminProperties;

    public AuthController(EmployeeRepository repository, PasswordEncoder passwordEncoder, 
                          net.javaguides.ems.service.EmailService emailService,
                          net.javaguides.ems.Config.AdminProperties adminProperties) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.adminProperties = adminProperties;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> user) {

        String email = user.get("email");
        String password = user.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        if (email.equals(adminProperties.getEmail()) && password.equals(adminProperties.getPassword())) {

            Map<String, String> response = new HashMap<>();
            response.put("token", "dummy-jwt-token");
            response.put("role", "ADMIN");

            // Email Notification for Admin Login
            emailService.sendLoginNotification(adminProperties.getEmail(), "ADMIN");

            return ResponseEntity.ok(response);
        }


        Employee employee = repository.findByEmail(email).orElse(null);

        if (employee != null) {
            if (employee.getStatus() != null && !employee.getStatus().equalsIgnoreCase("Active")) {
                return ResponseEntity.status(401).body("Account is inactive! Please contact admin.");
            }
            String stored = employee.getPassword();
            boolean matches = passwordEncoder.matches(password, stored);


            if (matches) {
                Map<String, String> response = new HashMap<>();
                response.put("token", "dummy-jwt-token");
                response.put("role", employee.getRole().name());
                response.put("id", String.valueOf(employee.getId()));
                
                // Trigger Login Notification Email
                emailService.sendLoginNotification(employee.getEmail(), employee.getRole().name());

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(401).body("Invalid email or password");
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
            employee.setStatus("Active");
        }

        if (employee.getJoiningDate() == null) {
            employee.setJoiningDate(java.time.LocalDate.now());
        }

        repository.save(employee);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }
}
