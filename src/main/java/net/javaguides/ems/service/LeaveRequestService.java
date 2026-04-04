package net.javaguides.ems.service;

import java.util.List;
import net.javaguides.ems.dto.LeaveRequestDTO;

public interface LeaveRequestService {
    LeaveRequestDTO applyLeave(LeaveRequestDTO leaveRequestDTO);
    LeaveRequestDTO updateLeaveStatus(Long leaveId, String status);
    List<LeaveRequestDTO> getEmployeeLeaves(Long employeeId);
    List<LeaveRequestDTO> getAllPendingLeaves();
}
