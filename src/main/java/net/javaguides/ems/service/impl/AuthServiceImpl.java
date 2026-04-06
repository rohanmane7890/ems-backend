package net.javaguides.ems.service.impl;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.javaguides.ems.dto.LoginRequest;
import net.javaguides.ems.dto.LoginResponse;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.service.AuthService;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	
	private final EmployeeRepository employeeRepository;
	
	@Override
	public LoginResponse login(LoginRequest request) {
		
		Employee employee=employeeRepository.findByEmail(request.getEmail())
				.orElseThrow(()->new RuntimeException("Invalid Email"));
		  if (!employee.getPassword().equals(request.getPassword())) {
	            throw new RuntimeException("Invalid Password");
	        }

	        // 🔒 Phase 9: Admin Master Key Security
	        if (employee.getRole().name().equals("ADMIN")) {
	            if (request.getSecretPin() == null || !request.getSecretPin().equals("7890")) {
	                throw new RuntimeException("Unauthorized: Master PIN Required for Admin Access");
	            }
	        }

	        return new LoginResponse("Login Successful", employee.getRole().name());
	}

}
