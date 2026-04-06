package net.javaguides.ems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.javaguides.ems.entity.WorkLog;

@Repository
public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {
    List<WorkLog> findByEmployeeIdOrderByDateDesc(Long employeeId);
}
