package net.javaguides.ems.mapper;

import net.javaguides.ems.dto.EmployeeDTO;


import net.javaguides.ems.entity.Employee;

public class EmployeeMapper {

    public static EmployeeDTO mapToEmployeeDTO(Employee employee) {

        return new EmployeeDTO(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getPassword(),
                employee.getPhoneNumber(),
                employee.getDepartment(),
                employee.getJoiningDate(),
                employee.getAddress(),
                employee.getStatus(),
                employee.getRole(),
                employee.getDesignation(),
                employee.getSalary() != null ? String.valueOf(employee.getSalary()) : null,
                employee.getProfilePhoto()
        );
    }

    public static Employee mapToEmployee(EmployeeDTO dto) {

        Employee employee = new Employee();

        employee.setId(dto.getId());
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPassword(dto.getPassword());
        employee.setPhoneNumber(dto.getPhoneNumber());
        employee.setDepartment(dto.getDepartment());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setAddress(dto.getAddress());
        employee.setStatus(dto.getStatus());
        employee.setRole(dto.getRole());

        employee.setDesignation(dto.getDesignation());
        
        // Safely parse salary string to double
        if (dto.getSalary() != null && !dto.getSalary().isEmpty()) {
            try {
                employee.setSalary(Double.parseDouble(dto.getSalary()));
            } catch (NumberFormatException e) {
                employee.setSalary(0.0);
            }
        } else {
            employee.setSalary(0.0);
        }
        
        employee.setProfilePhoto(dto.getProfilePhoto());

        return employee;
    }
}