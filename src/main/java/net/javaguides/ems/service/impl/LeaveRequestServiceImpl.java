package net.javaguides.ems.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.LeaveRequestDTO;
import net.javaguides.ems.entity.LeaveRequest;
import net.javaguides.ems.mapper.LeaveRequestMapper;
import net.javaguides.ems.repository.LeaveRequestRepository;
import net.javaguides.ems.service.LeaveRequestService;

@Service
@AllArgsConstructor
public class LeaveRequestServiceImpl implements LeaveRequestService {

    private LeaveRequestRepository leaveRequestRepository;

    @Override
    public LeaveRequestDTO applyLeave(LeaveRequestDTO leaveRequestDTO) {
        LeaveRequest leaveRequest = LeaveRequestMapper.mapToLeaveRequest(leaveRequestDTO);
        leaveRequest.setStatus("PENDING");
        LeaveRequest savedLeave = leaveRequestRepository.save(leaveRequest);
        return LeaveRequestMapper.mapToLeaveRequestDTO(savedLeave);
    }

    @Override
    public LeaveRequestDTO updateLeaveStatus(Long leaveId, String status) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        leaveRequest.setStatus(status);
        LeaveRequest updatedLeave = leaveRequestRepository.save(leaveRequest);
        return LeaveRequestMapper.mapToLeaveRequestDTO(updatedLeave);
    }

    @Override
    public List<LeaveRequestDTO> getEmployeeLeaves(Long employeeId) {
        List<LeaveRequest> leaves = leaveRequestRepository.findByEmployeeId(employeeId);
        return (leaves != null) ? leaves.stream()
                .map(LeaveRequestMapper::mapToLeaveRequestDTO)
                .collect(Collectors.toList()) : new java.util.ArrayList<>();
    }

    @Override
    public List<LeaveRequestDTO> getAllPendingLeaves() {
        List<LeaveRequest> leaves = leaveRequestRepository.findByStatus("PENDING");
        return (leaves != null) ? leaves.stream()
                .map(LeaveRequestMapper::mapToLeaveRequestDTO)
                .collect(Collectors.toList()) : new java.util.ArrayList<>();
    }
}
