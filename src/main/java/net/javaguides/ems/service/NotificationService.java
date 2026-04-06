package net.javaguides.ems.service;

import java.util.List;
import net.javaguides.ems.dto.NotificationDTO;

public interface NotificationService {
    NotificationDTO createNotification(Long employeeId, String message, String type);
    List<NotificationDTO> getEmployeeNotifications(Long employeeId);
    void markAsRead(Long notificationId);
    void markAllAsRead(Long employeeId);
}
