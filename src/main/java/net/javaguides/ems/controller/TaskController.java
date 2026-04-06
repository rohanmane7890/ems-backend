package net.javaguides.ems.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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
import net.javaguides.ems.dto.TaskDTO;
import net.javaguides.ems.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
@AllArgsConstructor
public class TaskController {

    private TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskDTO> assignTask(@RequestBody TaskDTO taskDTO) {
        return new ResponseEntity<>(taskService.assignTask(taskDTO), HttpStatus.CREATED);
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<List<TaskDTO>> getEmployeeTasks(@PathVariable("id") Long employeeId) {
        return ResponseEntity.ok(taskService.getEmployeeTasks(employeeId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable("id") Long taskId, @RequestParam("status") String status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status));
    }

    @PostMapping("/department")
    public ResponseEntity<List<TaskDTO>> assignTaskToDepartment(@RequestParam("dept") String department, @RequestBody TaskDTO template) {
        return new ResponseEntity<>(taskService.assignTaskToDepartment(department, template), HttpStatus.CREATED);
    }

    @PostMapping("/designation")
    public ResponseEntity<List<TaskDTO>> assignTaskByDesignation(@RequestParam("designation") String designation, @RequestBody TaskDTO template) {
        return new ResponseEntity<>(taskService.assignTaskByDesignation(designation, template), HttpStatus.CREATED);
    }
}
