package net.javaguides.ems.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.EmployeeDTO;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.Role;
import net.javaguides.ems.exception.ResourceNotFoundException;
import net.javaguides.ems.mapper.EmployeeMapper;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.service.EmployeeService;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private EmployeeRepository employeeRepository;
   

    
    
    
    @Override
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {

        Employee employee = EmployeeMapper.mapToEmployee(employeeDTO);

        if (employeeDTO.getDepartment() != null) {
            employee.setDepartment(employeeDTO.getDepartment().trim());
        }
        if (employeeDTO.getDesignation() != null) {
            employee.setDesignation(employeeDTO.getDesignation().trim());
        }

        employee.setPassword(employeeDTO.getPassword());
        employee.setRole(Role.EMPLOYEE);
        employee.setStatus("Active");

        Employee savedEmployee = employeeRepository.save(employee);

        return EmployeeMapper.mapToEmployeeDTO(savedEmployee);
    }

    @Override
    public EmployeeDTO getEmployeeById(Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id: " + employeeId));

        return EmployeeMapper.mapToEmployeeDTO(employee);
    }

  
    @Override
    public List<EmployeeDTO> getAllEmployees() {

        return employeeRepository.findAll()   
                .stream()
                .map(EmployeeMapper::mapToEmployeeDTO)
                .toList();
    }

    @Override
    public EmployeeDTO updateEmployee(Long employeeId, EmployeeDTO dto) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (dto.getFirstName() != null)
            employee.setFirstName(dto.getFirstName());

        if (dto.getLastName() != null)
            employee.setLastName(dto.getLastName());

        if (dto.getPhoneNumber() != null)
            employee.setPhoneNumber(dto.getPhoneNumber());

        if (dto.getAddress() != null)
            employee.setAddress(dto.getAddress());

        if (dto.getDepartment() != null)
            employee.setDepartment(dto.getDepartment().trim());

        if (dto.getDesignation() != null)
            employee.setDesignation(dto.getDesignation().trim());

        if (dto.getSalary() != null) {
            employee.setSalary(dto.getSalary());
        }

     
        if (dto.getProfilePhoto() != null) {
            employee.setProfilePhoto(dto.getProfilePhoto());
        }

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            employee.setPassword(dto.getPassword());
        }

        if (dto.getStatus() != null) {
            employee.setStatus(dto.getStatus());
        }

        if (dto.getRole() != null) {
            employee.setRole(dto.getRole());
        }

        Employee updatedEmployee = employeeRepository.save(employee);

        return EmployeeMapper.mapToEmployeeDTO(updatedEmployee);
    }
    
    
   

	@Override
    public void deleteEmployee(Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id: " + employeeId));

        employeeRepository.delete(employee);
    }

    @Override
    public List<EmployeeDTO> searchByDepartment(String department) {

        return employeeRepository.findByDepartmentIgnoreCase(department)
                .stream()
                .map(EmployeeMapper::mapToEmployeeDTO)
                .toList();
    }

    @Override
    public List<EmployeeDTO> getEmployeesByStatus(String status) {

        return employeeRepository.findByStatusIgnoreCase(status)
                .stream()
                .map(EmployeeMapper::mapToEmployeeDTO)
                .toList();
    }

    
   
    
    
    @Override
    public EmployeeDTO getEmployeeByEmail(String email) {

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found with email: " + email));

        return EmployeeMapper.mapToEmployeeDTO(employee);
    }

	@Override
	public List<EmployeeDTO> getByDepartmentAndStatus(String department, String status) {
	
		 return employeeRepository
		            .findByDepartmentIgnoreCaseAndStatusIgnoreCase(department, status)
		            .stream()
		            .map(EmployeeMapper::mapToEmployeeDTO)
		            .toList();
	}


	

	
}