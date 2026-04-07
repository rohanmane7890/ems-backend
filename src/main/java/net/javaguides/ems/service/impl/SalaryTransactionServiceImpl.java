package net.javaguides.ems.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;

import net.javaguides.ems.dto.SalaryTransactionDTO;
import net.javaguides.ems.entity.SalaryTransaction;
import net.javaguides.ems.repository.SalaryTransactionRepository;
import net.javaguides.ems.service.SalaryTransactionService;

@Service
@AllArgsConstructor
public class SalaryTransactionServiceImpl implements SalaryTransactionService {

    private final SalaryTransactionRepository repository;

    @Override
    public SalaryTransactionDTO recordPayment(SalaryTransactionDTO dto) {
        SalaryTransaction transaction = new SalaryTransaction();
        transaction.setEmployeeId(dto.getEmployeeId());
        transaction.setAmount(dto.getAmount());
        transaction.setPaymentMonth(dto.getPaymentMonth());
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setStatus("SUCCESS");
        transaction.setReferenceId(UUID.randomUUID().toString().substring(0, 13).toUpperCase());

        SalaryTransaction saved = repository.save(transaction);
        return mapToDTO(saved);
    }

    @Override
    public List<SalaryTransactionDTO> getPaymentHistory(Long employeeId) {
        return repository.findByEmployeeId(employeeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private SalaryTransactionDTO mapToDTO(SalaryTransaction entity) {
        return new SalaryTransactionDTO(
            entity.getId(),
            entity.getEmployeeId(),
            entity.getAmount(),
            entity.getPaymentMonth(),
            entity.getTransactionDate(),
            entity.getStatus(),
            entity.getReferenceId()
        );
    }
}
