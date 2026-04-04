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
                employee.getSalary(),
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
        employee.setSalary(dto.getSalary());
        employee.setProfilePhoto(dto.getProfilePhoto());

        return employee;
    }
}