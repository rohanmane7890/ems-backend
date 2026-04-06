package net.javaguides.ems.mapper;

import java.time.LocalDate;
import net.javaguides.ems.dto.LeaveRequestDTO;
import net.javaguides.ems.entity.LeaveRequest;

public class LeaveRequestMapper {

    public static LeaveRequestDTO mapToLeaveRequestDTO(LeaveRequest leaveRequest, String name, String email) {
        return new LeaveRequestDTO(
            leaveRequest.getId(),
            leaveRequest.getEmployeeId(),
            leaveRequest.getStartDate(),
            leaveRequest.getEndDate(),
            leaveRequest.getReason(),
            leaveRequest.getStatus(),
            leaveRequest.getType(),
            name,
            email,
            LocalDate.now() // Default appliedOn if not in entity
        );
    }

    // Overload for case where we don't have employee details yet
    public static LeaveRequestDTO mapToLeaveRequestDTO(LeaveRequest leaveRequest) {
        return mapToLeaveRequestDTO(leaveRequest, "Employee", "N/A");
    }

    public static LeaveRequest mapToLeaveRequest(LeaveRequestDTO dto) {
        return new LeaveRequest(
            dto.getId(),
            dto.getEmployeeId(),
            dto.getStartDate(),
            dto.getEndDate(),
            dto.getReason(),
            dto.getStatus(),
            dto.getType()
        );
    }
}
