package net.javaguides.ems.mapper;

import net.javaguides.ems.dto.NotificationDTO;
import net.javaguides.ems.entity.Notification;

public class NotificationMapper {

    public static NotificationDTO mapToNotificationDTO(Notification notification) {
        return new NotificationDTO(
            notification.getId(),
            notification.getEmployeeId(),
            notification.getMessage(),
            notification.getType(),
            notification.getCreatedAt(),
            notification.isRead()
        );
    }

    public static Notification mapToNotification(NotificationDTO dto) {
        return new Notification(
            dto.getId(),
            dto.getEmployeeId(),
            dto.getMessage(),
            dto.getType(),
            dto.getCreatedAt(),
            dto.isRead()
        );
    }
}
