package net.javaguides.ems.service;

import java.util.List;

import net.javaguides.ems.dto.EmployeeDTO;

public interface EmployeeService {
	EmployeeDTO createEmployee(EmployeeDTO employeeDTO);

	EmployeeDTO getEmployeeById(Long employeeId);
	
	List<EmployeeDTO> getAllEmployees();
	
	EmployeeDTO updateEmployee(Long employeeId,EmployeeDTO updatedEmployee);
	
	void deleteEmployee(Long employeeId);

	List<EmployeeDTO> searchByDepartment(String department);

	List<EmployeeDTO> getEmployeesByStatus(String status);
	
	EmployeeDTO getEmployeeByEmail(String email);

	List<EmployeeDTO> getByDepartmentAndStatus(String department, String status);

	
	
}
