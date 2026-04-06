package net.javaguides.ems.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import net.javaguides.ems.dto.LeaveRequestDTO;
import net.javaguides.ems.entity.LeaveRequest;
import net.javaguides.ems.mapper.LeaveRequestMapper;
import net.javaguides.ems.repository.LeaveRequestRepository;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.service.EmailService;
import net.javaguides.ems.service.LeaveRequestService;
import net.javaguides.ems.service.NotificationService;

@Service
public class LeaveRequestServiceImpl implements LeaveRequestService {

    @org.springframework.beans.factory.annotation.Value("${app.admin.email}")
    private String adminEmail;

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    public LeaveRequestServiceImpl(LeaveRequestRepository leaveRequestRepository, 
                                   EmployeeRepository employeeRepository, 
                                   EmailService emailService,
                                   NotificationService notificationService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    @Override
    public LeaveRequestDTO applyLeave(LeaveRequestDTO leaveRequestDTO) {
        LeaveRequest leaveRequest = LeaveRequestMapper.mapToLeaveRequest(leaveRequestDTO);
        leaveRequest.setStatus("PENDING");
        LeaveRequest savedLeave = leaveRequestRepository.save(leaveRequest);

        // 🔔 Notify Admin
        employeeRepository.findById(leaveRequest.getEmployeeId()).ifPresent(employee -> {
            String employeeName = employee.getFirstName() + " " + employee.getLastName();
            
            // 📧 Send Email to Admin
            emailService.sendLeaveRequestToAdmin(
                adminEmail, 
                employeeName, 
                leaveRequest.getType(), 
                leaveRequest.getStartDate().toString(), 
                leaveRequest.getEndDate().toString(), 
                leaveRequest.getReason()
            );

            String message = String.format("New Leave Request from %s (%s to %s)", 
                employeeName, leaveRequest.getStartDate(), leaveRequest.getEndDate());
            notificationService.createNotification(-1L, message, "LEAVE_REQUEST");
        });

        // Fetch employee details to return in DTO
        var employee = employeeRepository.findById(savedLeave.getEmployeeId()).orElse(null);
        String name = (employee != null) ? employee.getFirstName() + " " + employee.getLastName() : "Employee";
        String email = (employee != null) ? employee.getEmail() : "N/A";

        return LeaveRequestMapper.mapToLeaveRequestDTO(savedLeave, name, email);
    }

    @Override
    public LeaveRequestDTO updateLeaveStatus(Long leaveId, String status) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        
        leaveRequest.setStatus(status);
        LeaveRequest updatedLeave = leaveRequestRepository.save(leaveRequest);

        // Fetch employee to send email and dashboard notification
        employeeRepository.findById(leaveRequest.getEmployeeId()).ifPresent(employee -> {
            // 📧 Send Email
            emailService.sendLeaveStatusNotification(
                employee.getEmail(), 
                status, 
                leaveRequest.getStartDate().toString(), 
                leaveRequest.getEndDate().toString()
            );

            String message = String.format("Your leave request from %s to %s has been %s.", 
                leaveRequest.getStartDate(), leaveRequest.getEndDate(), status);
            notificationService.createNotification(employee.getId(), message, "LEAVE_STATUS");
        });

        // Fetch employee details to return in DTO
        var employee = employeeRepository.findById(updatedLeave.getEmployeeId()).orElse(null);
        String name = (employee != null) ? employee.getFirstName() + " " + employee.getLastName() : "Employee";
        String email = (employee != null) ? employee.getEmail() : "N/A";

        return LeaveRequestMapper.mapToLeaveRequestDTO(updatedLeave, name, email);
    }

    @Override
    public List<LeaveRequestDTO> getEmployeeLeaves(Long employeeId) {
        var employee = employeeRepository.findById(employeeId).orElse(null);
        String name = (employee != null) ? employee.getFirstName() + " " + employee.getLastName() : "Employee";
        String email = (employee != null) ? employee.getEmail() : "N/A";

        List<LeaveRequest> leaves = leaveRequestRepository.findByEmployeeId(employeeId);
        return (leaves != null) ? leaves.stream()
                .map(leave -> LeaveRequestMapper.mapToLeaveRequestDTO(leave, name, email))
                .collect(Collectors.toList()) : new java.util.ArrayList<>();
    }

    @Override
    public List<LeaveRequestDTO> getAllPendingLeaves() {
        List<LeaveRequest> leaves = leaveRequestRepository.findByStatus("PENDING");
        return (leaves != null) ? leaves.stream()
                .map(leave -> {
                    var employee = employeeRepository.findById(leave.getEmployeeId()).orElse(null);
                    String name = (employee != null) ? employee.getFirstName() + " " + employee.getLastName() : "Employee";
                    String email = (employee != null) ? employee.getEmail() : "N/A";
                    return LeaveRequestMapper.mapToLeaveRequestDTO(leave, name, email);
                })
                .collect(Collectors.toList()) : new java.util.ArrayList<>();
    }
}
