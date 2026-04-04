package net.javaguides.ems.service;

import java.time.LocalDate;
import java.util.List;
import net.javaguides.ems.dto.AttendanceDTO;

public interface AttendanceService {
    AttendanceDTO checkIn(Long employeeId);
    AttendanceDTO checkOut(Long employeeId);
    List<AttendanceDTO> getAttendanceHistory(Long employeeId);
    List<AttendanceDTO> getAttendanceByDate(LocalDate date);
}
