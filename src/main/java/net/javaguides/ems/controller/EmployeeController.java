package net.javaguides.ems.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.EmployeeDTO;
import net.javaguides.ems.service.EmployeeService;

@AllArgsConstructor
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

	private EmployeeService employeeService;
	 private final String uploadDir = "C:/ems-uploads/";
	@PostMapping
	public ResponseEntity<EmployeeDTO>createEmployee(@RequestBody EmployeeDTO employeeDTO){
		EmployeeDTO savedEmployee=employeeService.createEmployee(employeeDTO);
		return new ResponseEntity<>(savedEmployee,HttpStatus.CREATED);
	}
	
	@GetMapping("{id}")
	public ResponseEntity<EmployeeDTO>getEmployeeById(@PathVariable("id") Long employeeId){
		EmployeeDTO employeeDTO=employeeService.getEmployeeById(employeeId);
		return ResponseEntity.ok(employeeDTO);
	}
	
	@GetMapping
	public ResponseEntity<List<EmployeeDTO>> getAllEmployees(){
		List<EmployeeDTO>employees=employeeService.getAllEmployees();
		return ResponseEntity.ok(employees);
	}
	
	@PutMapping("{id}")
	public ResponseEntity<EmployeeDTO>updateEmployee(@PathVariable("id") Long employeeId,
			@RequestBody EmployeeDTO updatedEmployee){
	 EmployeeDTO employeeDTO=employeeService.updateEmployee(employeeId, updatedEmployee);
	 return ResponseEntity.ok(employeeDTO);
	}
	
	@DeleteMapping("{id}")
	public ResponseEntity<String>deleteEmployee(@PathVariable("id") Long employeeId){
		employeeService.deleteEmployee(employeeId);
		return ResponseEntity.ok("Employee deleted successfully!");
	}
	
	@GetMapping("/email/{email}")
	public ResponseEntity<EmployeeDTO> getEmployeeByEmail(@PathVariable String email) {
	    EmployeeDTO employeeDTO = employeeService.getEmployeeByEmail(email);
	    return ResponseEntity.ok(employeeDTO);
	} 
	
	@GetMapping("/search")
	public ResponseEntity<List<EmployeeDTO>> searchByDepartment(
	        @RequestParam(required = false) String department,
	        @RequestParam(required = false) String status) {

	    List<EmployeeDTO> employees;

	    if (department != null && status != null) {
	        employees = employeeService.getByDepartmentAndStatus(department, status);
	    } else if (department != null) {
	        employees = employeeService.searchByDepartment(department);
	    } else if (status != null) {
	        employees = employeeService.getEmployeesByStatus(status);
	    } else {
	        employees = employeeService.getAllEmployees();
	    }

	    return ResponseEntity.ok(employees);
	}

    @PutMapping("/{id}/change-password")
    public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestParam String newPassword) {
        EmployeeDTO employee = employeeService.getEmployeeById(id);
        employee.setPassword(newPassword);
        employeeService.updateEmployee(id, employee);
        return ResponseEntity.ok("Password updated successfully");
    }
    

    @PostMapping("/upload-photo")
    public String uploadPhoto(@RequestParam("file") MultipartFile file, @RequestParam("employeeId") Long employeeId) throws IOException {

        // Create directory if not exists
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Generate unique filename
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Save file
        File dest = new File(uploadDir + fileName);
        file.transferTo(dest);

        // Update link in database
        EmployeeDTO employee = employeeService.getEmployeeById(employeeId);
        employee.setProfilePhoto(fileName);
        employeeService.updateEmployee(employeeId, employee);

        // Return just the filename
        return fileName;
    }

}
