package net.javaguides.ems.repository;

import java.util.List;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.Role;

public interface EmployeeRepository extends JpaRepository<Employee, Long>{
	
	Optional<Employee> findByEmail(String email);
	
	@org.springframework.data.jpa.repository.Modifying
	@org.springframework.transaction.annotation.Transactional
	void deleteByEmail(String email);

	List<Employee> findByDepartmentIgnoreCase(String department);

	List<Employee> findByStatusIgnoreCase(String status);

	List<Employee>findByRoleNot(Role role);

	List<Employee> findByDepartmentIgnoreCaseAndStatusIgnoreCase(String department, String status);
	List<Employee> findByDesignationIgnoreCase(String designation);
}
