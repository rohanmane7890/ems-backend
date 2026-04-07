package net.javaguides.ems.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.TaskDTO;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.Task;
import net.javaguides.ems.mapper.TaskMapper;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.repository.TaskRepository;
import net.javaguides.ems.service.EmailService;
import net.javaguides.ems.service.NotificationService;
import net.javaguides.ems.service.TaskService;

@Service
@AllArgsConstructor
@SuppressWarnings("null")
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    @Override
    public TaskDTO assignTask(TaskDTO taskDTO) {
        Task task = TaskMapper.mapToTask(taskDTO);
        task.setStatus("PENDING");
        Task savedTask = taskRepository.save(task);

        Employee employee = employeeRepository.findById(savedTask.getAssignedTo()).orElse(null);
        if (employee != null) {
            // 🔔 Create In-App Notification
            notificationService.createNotification(
                employee.getId(), 
                "New Task Assigned: " + savedTask.getTitle() + ". Please complete it by " + savedTask.getDueDate(), 
                "TASK_ASSIGNED"
            );
            
            // 📧 Send Email Notification
            emailService.sendTaskAssignmentEmail(
                employee.getEmail(), 
                savedTask.getTitle(), 
                savedTask.getDueDate().toString()
            );
        }

        String name = (employee != null) ? employee.getFirstName() + " " + employee.getLastName() : "Employee";
        String email = (employee != null) ? employee.getEmail() : "N/A";

        return TaskMapper.mapToTaskDTO(savedTask, name, email);
    }

    @Override
    public List<TaskDTO> getEmployeeTasks(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        String name = (employee != null) ? employee.getFirstName() + " " + employee.getLastName() : "Employee";
        String email = (employee != null) ? employee.getEmail() : "N/A";

        return taskRepository.findByAssignedToOrderByDueDateAsc(employeeId).stream()
                .map(task -> TaskMapper.mapToTaskDTO(task, name, email))
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(task -> {
                    Employee employee = employeeRepository.findById(task.getAssignedTo()).orElse(null);
                    String name = (employee != null) ? employee.getFirstName() + " " + employee.getLastName() : "Employee";
                    String email = (employee != null) ? employee.getEmail() : "N/A";
                    return TaskMapper.mapToTaskDTO(task, name, email);
                })
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId).orElse(null);
        if (task != null) {
            task.setStatus(status);
            Task updatedTask = taskRepository.save(task);
            Employee employee = employeeRepository.findById(updatedTask.getAssignedTo()).orElse(null);
            String name = (employee != null) ? employee.getFirstName() + " " + employee.getLastName() : "Employee";
            String email = (employee != null) ? employee.getEmail() : "N/A";
            return TaskMapper.mapToTaskDTO(updatedTask, name, email);
        }
        return null;
    }

    @Override
    public List<TaskDTO> assignTaskToDepartment(String department, TaskDTO template) {
        List<Employee> employees = employeeRepository.findByDepartmentIgnoreCaseAndStatusIgnoreCase(department, "ACTIVE");
        return employees.stream().map(emp -> {
            Task task = TaskMapper.mapToTask(template);
            task.setAssignedTo(emp.getId());
            task.setStatus("PENDING");
            Task saved = taskRepository.save(task);
            
            // 🛡️ Alert each employee in department
            notificationService.createNotification(emp.getId(), "New Department Task: " + saved.getTitle(), "TASK_ASSIGNED");
            emailService.sendTaskAssignmentEmail(emp.getEmail(), saved.getTitle(), saved.getDueDate().toString());
            
            return TaskMapper.mapToTaskDTO(saved, emp.getFirstName() + " " + emp.getLastName(), emp.getEmail());
        }).collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> assignTaskByDesignation(String designation, TaskDTO template) {
        List<Employee> employees = employeeRepository.findByDesignationIgnoreCase(designation);
        return employees.stream().map(emp -> {
            Task task = TaskMapper.mapToTask(template);
            task.setAssignedTo(emp.getId());
            task.setStatus("PENDING");
            Task saved = taskRepository.save(task);
            
            // 🛡️ Alert each employee by designation
            notificationService.createNotification(emp.getId(), "New Task for " + designation + ": " + saved.getTitle(), "TASK_ASSIGNED");
            emailService.sendTaskAssignmentEmail(emp.getEmail(), saved.getTitle(), saved.getDueDate().toString());
            
            return TaskMapper.mapToTaskDTO(saved, emp.getFirstName() + " " + emp.getLastName(), emp.getEmail());
        }).collect(Collectors.toList());
    }
}
