package net.javaguides.ems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import net.javaguides.ems.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToOrderByDueDateAsc(Long employeeId);
}
