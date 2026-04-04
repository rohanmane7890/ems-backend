package net.javaguides.ems.mapper;

import net.javaguides.ems.dto.AttendanceDTO;
import net.javaguides.ems.entity.Attendance;

public class AttendanceMapper {

    public static AttendanceDTO mapToAttendanceDTO(Attendance attendance) {
        return new AttendanceDTO(
            attendance.getId(),
            attendance.getEmployeeId(),
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
