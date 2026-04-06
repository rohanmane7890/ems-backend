package net.javaguides.ems.service;

import java.util.List;
import net.javaguides.ems.dto.TaskDTO;

public interface TaskService {
    TaskDTO assignTask(TaskDTO taskDTO);
    List<TaskDTO> getEmployeeTasks(Long employeeId);
    List<TaskDTO> getAllTasks();
    TaskDTO updateTaskStatus(Long taskId, String status);
    List<TaskDTO> assignTaskToDepartment(String department, TaskDTO template);
    List<TaskDTO> assignTaskByDesignation(String designation, TaskDTO template);
}
