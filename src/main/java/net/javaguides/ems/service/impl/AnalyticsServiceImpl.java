package net.javaguides.ems.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.AnalyticsDTO;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.entity.Role;
import net.javaguides.ems.repository.AttendanceRepository;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.service.AnalyticsService;

@Service
@AllArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private EmployeeRepository employeeRepository;
    private AttendanceRepository attendanceRepository;

    @Override
    public AnalyticsDTO getDashboardAnalytics() {
        AnalyticsDTO analytics = new AnalyticsDTO();
        LocalDate today = LocalDate.now();

        // 🔹 Filter out Admins to only count Employees
        List<net.javaguides.ems.entity.Employee> allEmployees = employeeRepository.findByRoleNot(Role.ADMIN);
        
        long totalEmployees = (allEmployees != null) ? allEmployees.size() : 0;
        List<net.javaguides.ems.entity.Attendance> attendances = attendanceRepository.findByDate(today);
        long presentToday = (attendances != null) ? attendances.stream()
                .filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus())).count() : 0;
        long absentToday = totalEmployees - presentToday;

        long newJoiners = (allEmployees != null) ? allEmployees.stream()
                .filter(e -> e.getJoiningDate() != null && e.getJoiningDate().getMonthValue() == today.getMonthValue() 
                             && e.getJoiningDate().getYear() == today.getYear())
                .count() : 0;

        Map<String, Long> employeesByDept = (allEmployees != null) ? allEmployees.stream()
                .filter(e -> e.getDepartment() != null)
                .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting())) : new java.util.HashMap<>();

        double totalMonthlyPayroll = (allEmployees != null) ? allEmployees.stream()
                .filter(e -> e.getSalary() != null)
                .mapToDouble(Employee::getSalary)
                .sum() : 0.0;

        analytics.setTotalEmployees(totalEmployees);
        analytics.setPresentToday(presentToday);
        analytics.setAbsentToday(absentToday);
        analytics.setNewJoinersThisMonth(newJoiners);
        analytics.setEmployeesByDepartment(employeesByDept);
        analytics.setTotalMonthlyPayroll(totalMonthlyPayroll);

        return analytics;
    }
}
