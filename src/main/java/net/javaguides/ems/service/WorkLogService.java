package net.javaguides.ems.service;

import java.util.List;

import net.javaguides.ems.dto.WorkLogDTO;

public interface WorkLogService {
    WorkLogDTO submitWorkLog(WorkLogDTO workLogDTO);
    List<WorkLogDTO> getEmployeeWorkLogs(Long employeeId);
    List<WorkLogDTO> getAllWorkLogs();
}
