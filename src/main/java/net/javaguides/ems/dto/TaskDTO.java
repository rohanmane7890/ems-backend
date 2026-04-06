package net.javaguides.ems.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private Long assignedTo;
    private String assignedBy;
    private LocalDate dueDate;
    private String status;
    private String employeeName;
    private String employeeEmail;
}
