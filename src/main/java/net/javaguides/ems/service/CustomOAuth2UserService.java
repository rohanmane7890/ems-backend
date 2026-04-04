package net.javaguides.ems.service;

import java.util.Optional;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.Role;
import net.javaguides.ems.repository.EmployeeRepository;

@Service
@AllArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final EmployeeRepository repository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Extract attributes
        String email = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");

        if (email != null) {
            Optional<Employee> existingEmployee = repository.findByEmail(email);
            
            if (existingEmployee.isEmpty()) {
                // Provision a new employee
                Employee newEmployee = new Employee();
                newEmployee.setEmail(email);
                newEmployee.setFirstName(firstName != null ? firstName : "New");
                newEmployee.setLastName(lastName != null ? lastName : "User");
                newEmployee.setRole(Role.EMPLOYEE);
                newEmployee.setStatus("Active");
                newEmployee.setJoiningDate(java.time.LocalDate.now());
                newEmployee.setDepartment("Unassigned");
                newEmployee.setDesignation("Unassigned");
                newEmployee.setSalary(0.0);
                // No password needed for OAuth users
                newEmployee.setPassword(""); 
                
                repository.save(newEmployee);
                System.out.println("Provisioned new user via Google: " + email);
            } else {
                // Update existing user if needed
                Employee employee = existingEmployee.get();
                if (employee.getFirstName() == null || employee.getFirstName().equals("New")) {
                    employee.setFirstName(firstName);
                }
                if (employee.getLastName() == null || employee.getLastName().equals("User")) {
                    employee.setLastName(lastName);
                }
                repository.save(employee);
            }
        }

        return oAuth2User;
    }
}
