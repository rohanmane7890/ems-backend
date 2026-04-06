package net.javaguides.ems.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import net.javaguides.ems.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<Notification> findByEmployeeIdAndIsReadFalseOrderByCreatedAtDesc(Long employeeId);
}
