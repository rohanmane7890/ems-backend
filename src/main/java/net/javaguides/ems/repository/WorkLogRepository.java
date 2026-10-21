package net.javaguides.ems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import net.javaguides.ems.entity.WorkLog;

public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {
    List<WorkLog> findByEmployeeIdOrderByDateDesc(Long employeeId);
}
