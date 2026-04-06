package net.javaguides.ems.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.WorkLogDTO;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.WorkLog;
import net.javaguides.ems.mapper.WorkLogMapper;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.repository.WorkLogRepository;
import net.javaguides.ems.service.WorkLogService;

@Service
@AllArgsConstructor
public class WorkLogServiceImpl implements WorkLogService {

    private WorkLogRepository workLogRepository;
    private EmployeeRepository employeeRepository;

    @Override
    public WorkLogDTO submitWorkLog(WorkLogDTO workLogDTO) {
        WorkLog workLog = WorkLogMapper.mapToWorkLog(workLogDTO);
        workLog.setStatus("SUBMITTED");
        WorkLog savedLog = workLogRepository.save(workLog);
        
        Employee employee = employeeRepository.findById(savedLog.getEmployeeId()).orElse(null);
        String name = (employee != null) ? employee.getFirstName() + " " + employee.getLastName() : "Employee";
        String email = (employee != null) ? employee.getEmail() : "N/A";
        
        return WorkLogMapper.mapToWorkLogDTO(savedLog, name, email);
    }

    @Override
    public List<WorkLogDTO> getEmployeeWorkLogs(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        String name = (employee != null) ? employee.getFirstName() + " " + employee.getLastName() : "Employee";
        String email = (employee != null) ? employee.getEmail() : "N/A";

        return workLogRepository.findByEmployeeIdOrderByDateDesc(employeeId).stream()
                .map(log -> WorkLogMapper.mapToWorkLogDTO(log, name, email))
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkLogDTO> getAllWorkLogs() {
        return workLogRepository.findAll().stream()
                .map(log -> {
                    Employee employee = employeeRepository.findById(log.getEmployeeId()).orElse(null);
                    String name = (employee != null) ? employee.getFirstName() + " " + employee.getLastName() : "Employee";
                    String email = (employee != null) ? employee.getEmail() : "N/A";
                    return WorkLogMapper.mapToWorkLogDTO(log, name, email);
                })
                .collect(Collectors.toList());
    }
}
