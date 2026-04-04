package net.javaguides.ems.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.LeaveRequestDTO;
import net.javaguides.ems.service.LeaveRequestService;

@RestController
@RequestMapping("/api/leaves")
@AllArgsConstructor
public class LeaveRequestController {

    private LeaveRequestService leaveRequestService;

    @PostMapping
    public ResponseEntity<LeaveRequestDTO> applyLeave(@RequestBody LeaveRequestDTO leaveRequestDTO) {
        return ResponseEntity.ok(leaveRequestService.applyLeave(leaveRequestDTO));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequestDTO> updateLeaveStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(leaveRequestService.updateLeaveStatus(id, status));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequestDTO>> getEmployeeLeaves(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveRequestService.getEmployeeLeaves(employeeId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequestDTO>> getAllPendingLeaves() {
        return ResponseEntity.ok(leaveRequestService.getAllPendingLeaves());
    }
}
