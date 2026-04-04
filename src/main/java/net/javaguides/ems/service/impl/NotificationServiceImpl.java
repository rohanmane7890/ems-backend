package net.javaguides.ems.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.NotificationDTO;
import net.javaguides.ems.entity.Notification;
import net.javaguides.ems.mapper.NotificationMapper;
import net.javaguides.ems.repository.NotificationRepository;
import net.javaguides.ems.service.NotificationService;

@Service
@AllArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private NotificationRepository notificationRepository;

    @Override
    public NotificationDTO createNotification(Long employeeId, String message, String type) {
        Notification notification = new Notification();
        notification.setEmployeeId(employeeId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        
        Notification savedNotification = notificationRepository.save(notification);
        return NotificationMapper.mapToNotificationDTO(savedNotification);
    }

    @Override
    public List<NotificationDTO> getEmployeeNotifications(Long employeeId) {
        List<Notification> notifications = notificationRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
        return (notifications != null) ? notifications.stream()
                .map(NotificationMapper::mapToNotificationDTO)
                .collect(Collectors.toList()) : new java.util.ArrayList<>();
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
