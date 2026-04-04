package net.javaguides.ems.mapper;

import net.javaguides.ems.dto.LeaveRequestDTO;
import net.javaguides.ems.entity.LeaveRequest;

public class LeaveRequestMapper {

    public static LeaveRequestDTO mapToLeaveRequestDTO(LeaveRequest leaveRequest) {
        return new LeaveRequestDTO(
            leaveRequest.getId(),
            leaveRequest.getEmployeeId(),
            leaveRequest.getStartDate(),
            leaveRequest.getEndDate(),
            leaveRequest.getReason(),
            leaveRequest.getStatus()
        );
    }

    public static LeaveRequest mapToLeaveRequest(LeaveRequestDTO dto) {
        return new LeaveRequest(
            dto.getId(),
            dto.getEmployeeId(),
            dto.getStartDate(),
            dto.getEndDate(),
            dto.getReason(),
            dto.getStatus()
        );
    }
}
