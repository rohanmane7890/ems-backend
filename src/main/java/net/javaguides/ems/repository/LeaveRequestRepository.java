package net.javaguides.ems.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import net.javaguides.ems.entity.LeaveRequest;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeId(Long employeeId);
    List<LeaveRequest> findByStatus(String status);
}
