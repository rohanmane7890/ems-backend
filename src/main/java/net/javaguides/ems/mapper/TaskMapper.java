package net.javaguides.ems.mapper;

import net.javaguides.ems.dto.TaskDTO;
import net.javaguides.ems.entity.Task;

public class TaskMapper {

    public static TaskDTO mapToTaskDTO(Task task, String name, String email) {
        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getAssignedTo(),
                task.getAssignedBy(),
                task.getDueDate(),
                task.getStatus(),
                name,
                email
        );
    }

    public static Task mapToTask(TaskDTO dto) {
        return new Task(
                dto.getId(),
                dto.getTitle(),
                dto.getDescription(),
                dto.getAssignedTo(),
                dto.getAssignedBy(),
                dto.getDueDate(),
                dto.getStatus()
        );
    }
}
