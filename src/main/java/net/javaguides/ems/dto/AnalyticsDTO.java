package net.javaguides.ems.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private long totalEmployees;
    private long presentToday;
    private long absentToday;
    private long newJoinersThisMonth;
    private Map<String, Long> employeesByDepartment;
}
