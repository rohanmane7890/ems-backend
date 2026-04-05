package net.javaguides.ems.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import net.javaguides.ems.entity.Role;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EmployeeDTO {

	private Long id;
	@NotBlank(message = "First name is required")
	private String firstName;
	@NotBlank(message = "Last name is required")
	private String lastName;
	@NotBlank(message = "Email is required")
	@Email(message = "Please provide a valid email address")
	private String email;
	@NotBlank(message = "Password is required")
	@Size(min = 6, message = "Password must be at least 6 characters")
	private String password;
	private String phoneNumber;
	private String department;
	private LocalDate joiningDate;
	private String address;
	private String status;
	private Role role;
	private String designation;
	private String salary;
	private String profilePhoto;

}
