package net.javaguides.ems.mapper;

import net.javaguides.ems.dto.AttendanceDTO;
import net.javaguides.ems.entity.Attendance;
import net.javaguides.ems.entity.Employee;

public class AttendanceMapper {

    public static AttendanceDTO mapToAttendanceDTO(Attendance attendance) {
        return new AttendanceDTO(
            attendance.getId(),
            attendance.getEmployeeId(),
            null,
            null,
            null,
            attendance.getDate(),
            attendance.getCheckIn(),
            attendance.getCheckOut(),
            attendance.getStatus()
        );
    }

    public static AttendanceDTO mapToAttendanceDTO(Attendance attendance, Employee employee) {
        return new AttendanceDTO(
            attendance.getId(),
            attendance.getEmployeeId(),
            employee.getFirstName(),
            employee.getLastName(),
            employee.getDesignation(),
            attendance.getDate(),
            attendance.getCheckIn(),
            attendance.getCheckOut(),
            attendance.getStatus()
        );
    }

    public static Attendance mapToAttendance(AttendanceDTO dto) {
        return new Attendance(
            dto.getId(),
            dto.getEmployeeId(),
            dto.getDate(),
            dto.getCheckIn(),
            dto.getCheckOut(),
            dto.getStatus()
        );
    }
}
