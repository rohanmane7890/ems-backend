package net.javaguides.ems.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.AttendanceDTO;
import net.javaguides.ems.entity.Attendance;
import net.javaguides.ems.mapper.AttendanceMapper;
import net.javaguides.ems.repository.AttendanceRepository;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.entity.Employee;
import net.javaguides.ems.service.AttendanceService;
import net.javaguides.ems.service.NotificationService;

@Service
@AllArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private AttendanceRepository attendanceRepository;
    private EmployeeRepository employeeRepository;
    private NotificationService notificationService;

    private AttendanceDTO mapToDTO(Attendance attendance) {
        Employee employee = employeeRepository.findById(attendance.getEmployeeId())
                .orElse(null);
        if (employee != null) {
            return AttendanceMapper.mapToAttendanceDTO(attendance, employee);
        }
        return AttendanceMapper.mapToAttendanceDTO(attendance);
    }

    @Override
    public AttendanceDTO checkIn(Long employeeId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElse(new Attendance());
        
        attendance.setEmployeeId(employeeId);
        attendance.setDate(today);
        if (attendance.getCheckIn() == null) {
            attendance.setCheckIn(LocalTime.now().truncatedTo(ChronoUnit.SECONDS));
            attendance.setStatus("PRESENT");
        }
        Attendance savedAttendance = attendanceRepository.save(attendance);
        
        // 🔔 Notify Employee
        notificationService.createNotification(employeeId, 
            "Your Attendance for " + today + " has been recorded as PRESENT (Check-in: " + attendance.getCheckIn() + ").", 
            "ATTENDANCE_CHECKIN");

        return mapToDTO(savedAttendance);
    }

    @Override
    public AttendanceDTO checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new RuntimeException("Attendance record not found for today. Please check-in first."));
        
        attendance.setCheckOut(LocalTime.now().truncatedTo(ChronoUnit.SECONDS));
        Attendance savedAttendance = attendanceRepository.save(attendance);

        // 🔔 Notify Employee (Admin or Manual)
        notificationService.createNotification(employeeId, 
            "Your Attendance for " + today + " has been recorded (Check-out: " + attendance.getCheckOut() + ").", 
            "ATTENDANCE_OUT");

        return mapToDTO(savedAttendance);
    }

    @Override
    public List<AttendanceDTO> getAttendanceHistory(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getAttendanceByDate(LocalDate date) {
        // Fetch all active employees
        List<Employee> allEmployees = employeeRepository.findAll();
        
        // Fetch existing attendance records for this date
        List<Attendance> existingAttendance = attendanceRepository.findByDate(date);
        
        // Create a map of employeeId to attendance for quick lookup
        java.util.Map<Long, Attendance> attendanceMap = existingAttendance.stream()
                .collect(Collectors.toMap(Attendance::getEmployeeId, a -> a));
        
        // Merge them
        return allEmployees.stream().map(employee -> {
            Attendance attendance = attendanceMap.get(employee.getId());
            if (attendance != null) {
                return AttendanceMapper.mapToAttendanceDTO(attendance, employee);
            } else {
                // Return a mock DTO as ABSENT
                AttendanceDTO absentDto = new AttendanceDTO();
                absentDto.setEmployeeId(employee.getId());
                absentDto.setFirstName(employee.getFirstName());
                absentDto.setLastName(employee.getLastName());
                absentDto.setDesignation(employee.getDesignation());
                absentDto.setDate(date);
                absentDto.setStatus("ABSENT");
                return absentDto;
            }
        }).collect(Collectors.toList());
    }
}
