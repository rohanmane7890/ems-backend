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
public class WorkLogDTO {
    private Long id;
    private Long employeeId;
    private LocalDate date;
    private String tasksDescription;
    private Double hoursWorked;
    private String status;
    private Long taskId;
    private String employeeName;
    private String employeeEmail;
}
