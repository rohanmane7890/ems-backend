package net.javaguides.ems.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.WorkLogDTO;
import net.javaguides.ems.service.WorkLogService;

@RestController
@RequestMapping("/api/work-logs")
@AllArgsConstructor
public class WorkLogController {

    private WorkLogService workLogService;

    @PostMapping
    public ResponseEntity<WorkLogDTO> submitWorkLog(@RequestBody WorkLogDTO workLogDTO) {
        return new ResponseEntity<>(workLogService.submitWorkLog(workLogDTO), HttpStatus.CREATED);
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<List<WorkLogDTO>> getEmployeeWorkLogs(@PathVariable("id") Long employeeId) {
        return ResponseEntity.ok(workLogService.getEmployeeWorkLogs(employeeId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<WorkLogDTO>> getAllWorkLogs() {
        return ResponseEntity.ok(workLogService.getAllWorkLogs());
    }
}
