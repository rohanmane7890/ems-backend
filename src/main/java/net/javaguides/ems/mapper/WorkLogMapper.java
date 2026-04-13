package net.javaguides.ems.mapper;

import net.javaguides.ems.dto.WorkLogDTO;
import net.javaguides.ems.entity.WorkLog;

public class WorkLogMapper {

    public static WorkLogDTO mapToWorkLogDTO(WorkLog workLog, String name, String email) {
        return new WorkLogDTO(
                workLog.getId(),
                workLog.getEmployeeId(),
                workLog.getDate(),
                workLog.getTasksDescription(),
                workLog.getHoursWorked(),
                workLog.getStatus(),
                workLog.getTaskId(),
                name,
                email
        );
    }

    public static WorkLog mapToWorkLog(WorkLogDTO dto) {
        return new WorkLog(
                dto.getId(),
                dto.getEmployeeId(),
                dto.getDate(),
                dto.getTasksDescription(),
                dto.getHoursWorked(),
                dto.getTaskId(),
                dto.getStatus()
        );
    }
}
