package net.javaguides.ems.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.NotificationDTO;
import net.javaguides.ems.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@AllArgsConstructor
public class NotificationController {

    private NotificationService notificationService;

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<NotificationDTO>> getNotifications(@PathVariable Long employeeId) {
        return ResponseEntity.ok(notificationService.getEmployeeNotifications(employeeId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
