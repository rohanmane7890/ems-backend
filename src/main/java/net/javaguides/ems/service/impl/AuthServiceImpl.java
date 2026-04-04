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

	        return new LoginResponse("Login Successful", employee.getRole().name());
	}

}
