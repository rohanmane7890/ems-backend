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
@SuppressWarnings("null")
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
        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        if (employee == null) return java.util.Collections.emptyList();

        List<AttendanceDTO> existingRecords = attendanceRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        java.util.Map<LocalDate, AttendanceDTO> recordMap = existingRecords.stream()
                .collect(Collectors.toMap(AttendanceDTO::getDate, r -> r, (r1, r2) -> r1));

        List<AttendanceDTO> fullHistory = new java.util.ArrayList<>();
        LocalDate today = LocalDate.now();
        // Limit history to last 30 days or since joining date
        LocalDate startDate = employee.getJoiningDate();
        if (startDate == null) startDate = today.minusDays(30);
        
        LocalDate thirtyDaysAgo = today.minusDays(30);
        if (startDate.isBefore(thirtyDaysAgo)) {
            startDate = thirtyDaysAgo;
        }

        for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
            if (recordMap.containsKey(date)) {
                fullHistory.add(recordMap.get(date));
            } else {
                // Skip future dates (not possible here but good practice)
                AttendanceDTO absentDto = new AttendanceDTO();
                absentDto.setEmployeeId(employee.getId());
                absentDto.setFirstName(employee.getFirstName());
                absentDto.setLastName(employee.getLastName());
                absentDto.setDesignation(employee.getDesignation());
                absentDto.setDate(date);
                absentDto.setStatus("ABSENT");
                fullHistory.add(absentDto);
            }
        }

        // Return sorted by date descending
        return fullHistory.stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
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
