package net.javaguides.ems.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.AttendanceDTO;
import net.javaguides.ems.entity.Attendance;
import net.javaguides.ems.mapper.AttendanceMapper;
import net.javaguides.ems.repository.AttendanceRepository;
import net.javaguides.ems.service.AttendanceService;

@Service
@AllArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private AttendanceRepository attendanceRepository;

    @Override
    public AttendanceDTO checkIn(Long employeeId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElse(new Attendance());
        
        attendance.setEmployeeId(employeeId);
        attendance.setDate(today);
        if (attendance.getCheckIn() == null) {
            attendance.setCheckIn(LocalTime.now());
            attendance.setStatus("PRESENT");
        }
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return AttendanceMapper.mapToAttendanceDTO(savedAttendance);
    }

    @Override
    public AttendanceDTO checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new RuntimeException("Attendance record not found for today. Please check-in first."));
        
        attendance.setCheckOut(LocalTime.now());
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return AttendanceMapper.mapToAttendanceDTO(savedAttendance);
    }

    @Override
    public List<AttendanceDTO> getAttendanceHistory(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId).stream()
                .map(AttendanceMapper::mapToAttendanceDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date).stream()
                .map(AttendanceMapper::mapToAttendanceDTO)
                .collect(Collectors.toList());
    }
}
