package net.javaguides.ems.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.Role;
import net.javaguides.ems.repository.EmployeeRepository;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(EmployeeRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if any user already exists
            if (repository.count() == 0) {
                Employee admin = new Employee();
                admin.setFirstName("System");
                admin.setLastName("Admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(passwordEncoder.encode("admin123")); // Default password
                admin.setRole(Role.ADMIN);
                admin.setStatus("Active");
                admin.setJoiningDate(LocalDate.now());
                admin.setDepartment("Admin");
                admin.setDesignation("Super User");
                admin.setSalary(0.0);

                repository.save(admin);
                System.out.println("Default Admin created: admin@gmail.com / admin123");
            }
        };
    }
}
