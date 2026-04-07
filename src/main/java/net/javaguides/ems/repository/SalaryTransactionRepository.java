package net.javaguides.ems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import net.javaguides.ems.entity.SalaryTransaction;

public interface SalaryTransactionRepository extends JpaRepository<SalaryTransaction, Long> {
    List<SalaryTransaction> findByEmployeeId(Long employeeId);
}
